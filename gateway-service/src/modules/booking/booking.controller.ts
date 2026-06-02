import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from "@nestjs/common"
import { BookingClientGrpc } from "./booking.grpc"
import { ApiBearerAuth } from "@nestjs/swagger"
import { CurrentUser, Protected } from "src/shared/decorators"


@Controller('bookings')
export class BookingController {
  public constructor(private readonly payment: BookingClientGrpc) {}


  @ApiBearerAuth()
  @Protected()
  @Get()
  @HttpCode(HttpStatus.OK)
  public async getBookingMethods(@CurrentUser() userId: string) {
    const response = await this.payment.call('getUserBookings', {
      userId
    });

    return Array.isArray(response.bookings) ? response.bookings : [];
  }
}