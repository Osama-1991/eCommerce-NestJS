import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Auth, User } from 'src/common/z_index';
import { IUser, RoleTypes } from 'src/DB/z_index';
import { CartService } from 'src/module/cart/cart.service';
import { createCartDto, oneCartResponse } from './entities/cart.entity';

@Resolver()
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Auth([RoleTypes.user])
  @Mutation(() => oneCartResponse, { name: 'CreateCart' })
  createCart(@User() user: IUser, @Args('CartInputs') query: createCartDto) {
    const param = {
      productId: query.productId,
    };
    return this.cartService.addToCart(user, param, query);
  }
}
