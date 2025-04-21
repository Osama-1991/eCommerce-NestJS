import { Module } from '@nestjs/common';
import { CartResolver } from './cart.resolver';
import { CartService } from 'src/module/cart/cart.service';
import { CartModel, CartRepositoryService } from 'src/DB/z_index';

@Module({
  imports: [CartModel],

  providers: [CartResolver, CartService, CartRepositoryService],
})
export class CartModule {}
