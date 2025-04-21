import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DBRepository } from './mainRepository/DB.Repository';
import { Cart, CartDoc } from 'src/DB/z_index';

@Injectable()
export class CartRepositoryService extends DBRepository<CartDoc> {
  constructor(
    @InjectModel(Cart.name)
    private cartModel: Model<CartDoc>,
  ) {
    super(cartModel);
  }
  async getCartById(cartId: Types.ObjectId): Promise<CartDoc> {
    const cart = await this.findById({ id: cartId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }
  async getCartByUserId(userId: Types.ObjectId): Promise<CartDoc> {
    const cart = await this.findOne({ filter: { createdBy: userId } });
    if (!cart?.products?.length) {
      throw new BadRequestException('Empty Cart');
    }
    return cart;
  }
}
