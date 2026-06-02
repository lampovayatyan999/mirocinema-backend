import { Controller, Get, HttpCode, HttpStatus, Param} from "@nestjs/common"
import { SeatClientGrpc } from "./seat.grpc"


@Controller('seats')
export class SeatController {
  public constructor(private readonly seat: SeatClientGrpc) {}


  @Get(':hall_id/:screening_id')
  @HttpCode(HttpStatus.OK)
  public async listSeatsByHall(@Param('hall_id') hallId: string, @Param('screening_id') screeningId: string) {
    const response = await this.seat.call('listSeatsByHall', {hallId, screeningId})
    
    return Array.isArray(response.seats) ? response.seats : []
  }

}