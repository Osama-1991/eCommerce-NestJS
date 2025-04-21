import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartModel, CartRepositoryService } from 'src/DB/z_index';

@Module({
  imports: [CartModel],
  controllers: [CartController],
  providers: [CartService, CartRepositoryService],
})
export class CartModule {}
