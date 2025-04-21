/* eslint-disable @typescript-eslint/no-base-to-string */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CartRepositoryService,
  ProductRepositoryService,
  ICart,
  IUser,
  CartPopulate,
} from 'src/DB/z_index';
import { IItemsIdsDto, IProductIdCartDto } from './dto/get.dto';
import { createCartDto } from './dto/create.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepositoryService: CartRepositoryService,
    private readonly productRepositoryService: ProductRepositoryService,
  ) {}

  async addToCart(
    user: IUser,
    params: IProductIdCartDto,
    body: createCartDto,
  ): Promise<ICart> {
    const { quantity } = body;
    const { productId } = params;
    const productExist =
      await this.productRepositoryService.getProductByQuantity(
        productId,
        quantity,
      );
    const userCart = await this.cartRepositoryService.findOne({
      filter: { userId: user._id },
    });
    if (!userCart) {
      return await this.cartRepositoryService.create({
        userId: user._id,
        products: [
          {
            productId,
            quantity,
            finalPrice: productExist.finalPrice,
          },
        ],
      });
    }
    const isProductAdded = userCart?.products.find(
      (product) => product.productId.toString() === productId.toString(),
    );
    if (isProductAdded) {
      throw new BadRequestException('Product already added to cart');
    }

    userCart.products.push({
      productId,
      quantity,
      finalPrice: productExist.finalPrice,
    });
    await userCart.save();

    const CreatedUserCart = await this.cartRepositoryService.findById({
      id: userCart._id,
      populate: Object.values(CartPopulate),
    });

    if (!CreatedUserCart) {
      throw new NotFoundException('cart not found');
    }

    return CreatedUserCart;
  }

  async removeFromCart(
    user: IUser,
    params: IProductIdCartDto,
  ): Promise<{ message: string; userCart: ICart }> {
    const { productId } = params;

    await this.productRepositoryService.getProductById(productId);
    const userCart = await this.cartRepositoryService.findOne({
      filter: { userId: user._id, 'products.productId': productId },
    });
    if (!userCart) {
      throw new NotFoundException('Product not found in this cart');
    }
    userCart.products = userCart.products.filter(
      (product) => product.productId !== productId,
    );
    await userCart.save();
    return {
      message: 'Product removed from cart successfully',
      userCart: userCart,
    };
  }

  async removeItemsFromCart(
    user: IUser,
    body: IItemsIdsDto,
  ): Promise<{ message: string; userCart: ICart }> {
    const { productIds } = body;
    const userCart = await this.cartRepositoryService.findOneAndUpdate({
      filter: { userId: user._id },
      update: { $pull: { products: { productId: { $in: productIds } } } },
    });
    if (!userCart) {
      throw new NotFoundException('Cart not found');
    }
    if (userCart?.products?.length) {
      await userCart.save();
    }

    return {
      message: 'Products removed from cart successfully',
      userCart: userCart,
    };
  }

  async clearCart(user: IUser): Promise<{ message: string; userCart: ICart }> {
    const userCart = await this.cartRepositoryService.findOneAndUpdate({
      filter: { userId: user._id },
      update: { $set: { products: [] } },
    });
    if (!userCart) {
      throw new NotFoundException('Cart not found');
    }
    return {
      message: 'Cart cleared successfully',
      userCart: userCart,
    };
  }

  async updateProductQuantity(
    user: IUser,
    params: IProductIdCartDto,
    body: createCartDto,
  ) {
    const { quantity } = body;
    const { productId } = params;

    await this.productRepositoryService.getProductByQuantity(
      productId,
      quantity,
    );
    const userCart = await this.cartRepositoryService.findOne({
      filter: { userId: user._id, 'products.productId': productId },
    });
    if (!userCart) {
      throw new NotFoundException('Product not found in this cart');
    }
    userCart.products.find((product) => {
      if (product.productId === productId) {
        product.quantity = quantity;
        return product;
      }
    });
    return await userCart.save();
  }

  async getCart(user: IUser): Promise<ICart> {
    const userCart = await this.cartRepositoryService.findOne({
      filter: { userId: user._id },
      populate: [{ path: 'products.productId' }],
    });
    if (!userCart) {
      throw new NotFoundException('Cart is empty');
    }
    return userCart;
  }
}
