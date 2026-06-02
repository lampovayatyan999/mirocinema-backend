import { Injectable } from '@nestjs/common'
import { nanoid } from 'nanoid'
import { DatabaseService } from 'src/infra/database/database.service'

import { TICKET_QUERIES } from 'src/infra/sql/queries/ticket.queries'

import type { Order } from './interfaces/order.interface'
import type { Ticket } from './interfaces/ticket.interface'
import { ORDER_QUERIES } from 'src/infra/sql/queries/order.quiries'
import { ORDER_COMMANDS } from 'src/infra/sql/order/order.command'
import { TICKET_COMMANDS } from 'src/infra/sql/order/ticket.command'

@Injectable()
export class BookingRepository {
    public constructor(private readonly database: DatabaseService) {}

    public findUserPaidOrders(userId: string) {
        return this.database.raw<Order>(
            ORDER_QUERIES.FIND_PAID_ORDERS_FOR_USER,
            [userId]
        )
    }

    public async createOrder(input: Pick<Order, 'user_id' | 'amount'>) {
        const rows = await this.database.raw<Order>(
            ORDER_COMMANDS.CREATE_ORDER,
            [nanoid(), input.user_id, input.amount]
        )

        return rows[0]
    }

    public async markOrderPaid(orderId: string) {
        await this.database.raw(ORDER_COMMANDS.SET_ORDER_PAID, [orderId])
    }

    public async updateOrderQr(orderId: string, qrCode: string | null) {
        await this.database.raw(ORDER_COMMANDS.SAVE_QR, [qrCode, orderId])
    }

    public async findOrderById(orderId: string) {
        const rows = await this.database.raw<Order>(
            ORDER_QUERIES.FIND_ORDER_BY_ID,
            [orderId]
        )

        return rows[0] ?? null
    }

    public async cancelOrder(orderId: string) {
        await this.database.raw(ORDER_COMMANDS.CANCEL_ORDER, [orderId])
    }

    public async findExistingTicket(screeningId: string, seatId: string) {
        const rows = await this.database.raw<Ticket>(
            TICKET_QUERIES.FIND_EXISTING_TICKET,
            [screeningId, seatId]
        )

        return rows[0] ?? null
    }

    public async createTicket(
        input: Pick<
            Ticket,
            'screening_id' | 'hall_id' | 'seat_id' | 'price' | 'order_id'
        >
    ) {
        const rows = await this.database.raw<Ticket>(
            TICKET_COMMANDS .CREATE_TICKET,
            [
                nanoid(),
                input.screening_id,
                input.hall_id,
                input.seat_id,
                input.price,
                input.order_id
            ]
        )

        return rows[0]
    }

    public async markTicketsPaid(input: Pick<Ticket, 'order_id' | 'paid_at'>) {
        await this.database.raw(TICKET_COMMANDS.MARK_TICKETS_PAID, [
            input.paid_at,
            input.order_id
        ])
    }

    public async deleteTicketsByOrderId(orderId: string) {
        await this.database.raw(TICKET_COMMANDS.DELETE_TICKETS_FOR_ORDER, [
            orderId
        ])
    }

    public async findReservedSeatIds(hallId: string, screeningId: string) {
        return this.database.raw<{ seat_id: string }>(
            TICKET_QUERIES.LIST_RESERVED_SEATS,
            [hallId, screeningId]
        )
    }
}