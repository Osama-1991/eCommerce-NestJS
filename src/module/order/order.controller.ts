import { Body, Controller, Param, Patch, Post, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth, User } from 'src/common/z_index';
import { CreateOrderDto } from './dto/create.dto';
import { OrderIdDto } from './dto/get.dto';
import { Request } from 'express';
import { IUser, RoleTypes } from '../../DB/z_index';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Auth([RoleTypes.user])
  @Post('create-order')
  async createOrder(@User() user: IUser, @Body() Body: CreateOrderDto) {
    return await this.orderService.createOrder(user, Body);
  }

  /*****************************************************************************************************/

  @Auth([RoleTypes.user])
  @Post('check-out/:orderId')
  async checkOut(@User() user: IUser, @Param() params: OrderIdDto) {
    return await this.orderService.checkOut(user, params);
  }

  /*****************************************************************************************************/

  @Post('webhook')
  webhook(@Req() req: Request) {
    return this.orderService.webhook(req);
  }

  /*****************************************************************************************************/

  @Auth([RoleTypes.user])
  @Patch('cancel-order/:orderId')
  async cancelOrder(@Param() param: OrderIdDto, @User() user: IUser) {
    return await this.orderService.cancelOrder(param.orderId, user);
  }
}
