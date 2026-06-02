import { Injectable } from '@nestjs/common';
import { BookingRepository } from './booking.repository';
import { OrderStatus } from './enums/order-status.enum';
import { TheaterClientGrpc } from 'src/clients/theater-client.grpc';
import { HallClientGrpc } from 'src/clients/hall-client.grpc';
import { SeatClientGrpc } from 'src/clients/seat-client.grpc';
import { MovieClientGrpc } from 'src/clients/movie-client.grpc';
import { ScreeningClientGrpc } from 'src/clients/screening-client.grpc';
import { CancelBookingRequest, ConfirmBookingRequest, CreateReservationRequest, GetUserBookingsRequest, ListReservedSeatsRequest } from '@mirocinema/contracts/gen/ts/booking';
import { lastValueFrom } from 'rxjs';
import { RpcException } from '@nestjs/microservices'

import * as QRCode from 'qrcode'
import { RpcStatus } from '@mirocinema/common';
import { Order } from './interfaces/order.interface';

@Injectable()
export class BookingService {
  public constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly theaterClient: TheaterClientGrpc,
    private readonly hallClient: HallClientGrpc,
    private readonly seatClient: SeatClientGrpc,
    private readonly movieClient: MovieClientGrpc,
    private readonly screeningClient: ScreeningClientGrpc
  ) {}

  // ─── Public Methods ───────────────────────────────────────────────────────────

  public async getUserBookings(data: GetUserBookingsRequest) {
    const { userId } = data

    const orders = await this.bookingRepository.findUserPaidOrders(userId)

    if (!orders.length) return { bookings: [] }

    const context = this.createRequestContext()
    const bookings = await this.enrichOrders(orders, context)

    return { bookings }
  }

  public async createReservation(data: CreateReservationRequest) {
    const { userId, screeningId, seats } = data

    const { screening } = await lastValueFrom(
      this.screeningClient.getById({ id: screeningId })
    )

    if (!screening) {
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        details: 'Screening not found'
      })
    }

    const amount = seats.reduce((s, a) => s + a.price, 0)

    const order = await this.bookingRepository.createOrder({
      user_id: userId,
      amount
    })

    const tickets = await Promise.all(
      seats.map(async s => {
        const existing = await this.bookingRepository.findExistingTicket(
          screeningId,
          s.seatId
        )

        if (existing) {
          throw new RpcException({
            code: RpcStatus.INVALID_ARGUMENT,
            details: `Место ${s.seatId} уже занято`
          })
        }

        return this.bookingRepository.createTicket({
          screening_id: screening.id,
          hall_id: screening.hall?.id!,
          seat_id: s.seatId,
          price: s.price,
          order_id: order.id
        })
      })
    )

    return {
      orderId: order.id,
      ticketIds: tickets.map(t => t.id),
      amount
    }
  }

  public async confirmBooking(data: ConfirmBookingRequest) {
    const { bookingId } = data

    await this.bookingRepository.markOrderPaid(bookingId)

    const now = new Date()

    await this.bookingRepository.markTicketsPaid({
      order_id: bookingId,
      paid_at: now
    })

    const qrDataUrl = await QRCode.toDataURL(bookingId)
    await this.bookingRepository.updateOrderQr(bookingId, qrDataUrl)

    return { ok: true }
  }

  public async cancelBooking(data: CancelBookingRequest) {
    const { bookingId, userId } = data

    const order = await this.bookingRepository.findOrderById(bookingId)

    if (!order) {
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        details: 'Order not found'
      })
    }

    if (order.user_id !== userId) {
      throw new RpcException({
        code: RpcStatus.PERMISSION_DENIED,
        details: 'You have no rights to cancel this booking'
      })
    }

    if (order.status === OrderStatus.CANCELLED) {
      return { ok: true }
    }

    if (order.status !== OrderStatus.PAID) {
      throw new RpcException({
        code: RpcStatus.FAILED_PRECONDITION,
        details: 'Reservation not paid or already canceled'
      })
    }

    await this.bookingRepository.cancelOrder(bookingId)
    await this.bookingRepository.deleteTicketsByOrderId(bookingId)

    return { ok: true }
  }

  public async listReservedSeats(data: ListReservedSeatsRequest) {
    const { hallId, screeningId } = data

    const seats = await this.bookingRepository.findReservedSeatIds(
      hallId,
      screeningId
    )

    return {
      reservedSeatIds: seats.map(s => s.seat_id)
    }
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────────

  private createRequestContext() {
    return {
      screenings: new Map<string, any>(),
      halls: new Map<string, any>(),
      seats: new Map<string, any>(),
      movies: new Map<string, any>(),
      theaters: new Map<string, any>()
    }
  }

  private async enrichOrders(
    orders: Order[],
    ctx: ReturnType<typeof this.createRequestContext>
  ) {
    return Promise.all(
      orders.map(async order => {
        const ticket = order.tickets[0]
        if (!ticket) return null

        const screening = await this.getScreening(ticket.screening_id, ctx)

        if (!screening) return null

        const [movie, hall, theater] = await Promise.all([
          this.getMovie(screening.movie?.id, ctx),
          this.getHall(ticket.hall_id, ctx),
          this.getTheater(screening.theater?.id, ctx)
        ])

        const seats = await Promise.all(
          order.tickets.map(async t => {
            const seat = await this.getSeat(t.seat_id, ctx)
            return {
              id: t.seat_id,
              row: seat?.row ?? 0,
              number: seat?.number ?? 0
            }
          })
        )

        return {
          id: order.id,
          screeningDate: screening.startAt.split('T')[0],
          screeningTime: new Date(
            screening.startAt
          ).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          movie,
          hall,
          theater,
          seats,
          qrCode: order.qr_code ?? ''
        }
      })
    )
  }

  private async getScreening(id: string, ctx: any) {
    if (!ctx.screenings.has(id)) {
      const { screening } = await lastValueFrom(
        this.screeningClient.getById({ id })
      )
      ctx.screenings.set(id, screening)
    }
    return ctx.screenings.get(id)
  }

  private async getMovie(id: string | undefined, ctx: any) {
    if (!id) return null
    if (!ctx.movies.has(id)) {
      const { movie } = await lastValueFrom(
        this.movieClient.getById({ id })
      )
      ctx.movies.set(id, movie)
    }
    return ctx.movies.get(id)
  }

  private async getHall(id: string, ctx: any) {
    if (!ctx.halls.has(id)) {
      const { hall } = await lastValueFrom(
        this.hallClient.getById({ id })
      )
      ctx.halls.set(id, hall)
    }
    return ctx.halls.get(id)
  }

  private async getTheater(id: string | undefined, ctx: any) {
    if (!id) return null
    if (!ctx.theaters.has(id)) {
      const { theater } = await lastValueFrom(
        this.theaterClient.getById({ id })
      )
      ctx.theaters.set(id, theater)
    }
    return ctx.theaters.get(id)
  }

  private async getSeat(id: string, ctx: any) {
    if (!ctx.seats.has(id)) {
      const { seat } = await lastValueFrom(
        this.seatClient.getById({ id })
      )
      ctx.seats.set(id, seat)
    }
    return ctx.seats.get(id)
  }
}