import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { User, Auth } from 'src/common/z_index';
import { createCartDto } from './dto/create.dto';
import { IItemsIdsDto, IProductIdCartDto } from './dto/get.dto';
import { IUser, RoleTypes } from '../../DB/interfaces/user.interface';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Auth([RoleTypes.user])
  @Post('add-to-cart/:productId')
  async addToCart(
    @User() user: IUser,
    @Body() body: createCartDto,
    @Param() params: IProductIdCartDto,
  ) {
    return await this.cartService.addToCart(user, params, body);
  }

  @Auth([RoleTypes.user])
  @Delete('remove-from-cart/:productId')
  async removeFromCart(
    @User() user: IUser,
    @Param() params: IProductIdCartDto,
  ) {
    return await this.cartService.removeFromCart(user, params);
  }

  @Auth([RoleTypes.user])
  @Patch('remove-items-from-cart')
  async removeItemsFromCart(@User() user: IUser, @Body() body: IItemsIdsDto) {
    return await this.cartService.removeItemsFromCart(user, body);
  }

  @Auth([RoleTypes.user])
  @Delete('clear-cart')
  async clearCart(@User() user: IUser) {
    return await this.cartService.clearCart(user);
  }

  @Auth([RoleTypes.user])
  @Patch('update-product-quantity/:productId')
  async updateProductQuantity(
    @User() user: IUser,
    @Body() body: createCartDto,
    @Param() params: IProductIdCartDto,
  ) {
    return await this.cartService.updateProductQuantity(user, params, body);
  }

  @Auth([RoleTypes.user])
  @Get('get-cart')
  async getCart(@User() user: IUser) {
    return await this.cartService.getCart(user);
  }
}
