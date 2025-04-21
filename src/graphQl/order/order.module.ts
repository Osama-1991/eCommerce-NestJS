import { Module } from '@nestjs/common';
import { orderResolve } from './order.resolver';
import { OrderService } from 'src/module/order/order.service';
import {
  CartModel,
  CartRepositoryService,
  CouponModel,
  CouponRepositoryService,
  OrderModel,
  OrderRepositoryService,
} from 'src/DB/z_index';
import { PaymentService } from 'src/common/service/payment.service';

@Module({
  imports: [OrderModel, CartModel, CouponModel],
  providers: [
    orderResolve,
    OrderService,
    OrderRepositoryService,
    CartRepositoryService,
    CouponRepositoryService,
    PaymentService,
    orderResolve,
  ],
})
export class OrderModule {}
