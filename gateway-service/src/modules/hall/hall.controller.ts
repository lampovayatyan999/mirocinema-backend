import {Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query} from "@nestjs/common"
import { Protected } from "src/shared/decorators"
import { Role } from "src/shared/guards"
import { HallClientGrpc } from "./hall.grpc"
import { CreateHallRequest } from "./dto"




@Controller('halls')
export class HallController {
  public constructor(private readonly theater: HallClientGrpc) {}


  @Get('theaters')
  @HttpCode(HttpStatus.OK)
  public async getById(@Param('id') id: string) {
    const {hall} = await this.theater.call('getHall', {id})
    
    return hall
  }


  @Protected(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() dto: CreateHallRequest) {
    return await this.theater.call('createHall', dto)
  }
}