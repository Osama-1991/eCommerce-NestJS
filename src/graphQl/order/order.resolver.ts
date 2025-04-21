import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrderService } from 'src/module/order/order.service';
import { createOrderDto, oneOrderResponse } from './entities/order.entity';
import { Auth, User } from 'src/common/z_index';
import { IUser, RoleTypes } from 'src/DB/z_index';

@Resolver()
export class orderResolve {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => [oneOrderResponse], { name: 'listOrders' })
  list() {
    return this.orderService.findAll();
  }
  @Auth([RoleTypes.user])
  @Mutation(() => oneOrderResponse, { name: 'CreateOrder' })
  createOrder(@User() user: IUser, @Args('orderInputs') query: createOrderDto) {
    return this.orderService.createOrder(user, query);
  }
}
