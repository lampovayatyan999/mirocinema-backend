import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectGrpcClient } from '@mirocinema/common';
import type { ClientGrpc } from '@nestjs/microservices';

import type { BookingServiceClient, CreateReservationRequest, ConfirmBookingRequest, CancelBookingRequest} from '@mirocinema/contracts/gen/ts/booking';

@Injectable()
export class BookingClientGrpc implements OnModuleInit {
  private bookingService!: BookingServiceClient;

  constructor(
    @InjectGrpcClient('BOOKING_PACKAGE') private readonly client: ClientGrpc
  ) {}

  public onModuleInit() {
    this.bookingService = 
      this.client.getService<BookingServiceClient>('BookingService');
  }

  public createReservation(request: CreateReservationRequest) {
    return this.bookingService.createReservation(request);
  }

  public confirmBooking(data: ConfirmBookingRequest) {
    return this.bookingService.confirmBooking(data);
  }

  public cancelBooking(data: CancelBookingRequest) {
    return this.bookingService.cancelBooking(data);
  }
}