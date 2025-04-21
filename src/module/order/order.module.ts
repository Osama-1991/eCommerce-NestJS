import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import {
  CartRepositoryService,
  CouponRepositoryService,
  OrderRepositoryService,
  CartModel,
  CouponModel,
  OrderModel,
} from 'src/DB/z_index';
import { PaymentService } from 'src/common/service/payment.service';

@Module({
  imports: [OrderModel, CartModel, CouponModel],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepositoryService,
    CartRepositoryService,
    CouponRepositoryService,
    PaymentService,
  ],
})
export class OrderModule {}
