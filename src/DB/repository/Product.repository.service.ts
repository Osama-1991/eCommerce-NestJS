import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DBRepository } from './mainRepository/DB.Repository';
import { Product, ProductDoc } from '../model/product.model';

@Injectable()
export class ProductRepositoryService extends DBRepository<ProductDoc> {
  constructor(
    @InjectModel(Product.name)
    private ProductModel: Model<ProductDoc>,
  ) {
    super(ProductModel);
  }
  async getProductById(productId: Types.ObjectId): Promise<ProductDoc> {
    const product = await this.findById({ id: productId });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async checkProductNameExist(name: string): Promise<null> {
    const product = await this.findOne({ filter: { name } });
    if (product) {
      throw new ConflictException('Product name is exist');
    }
    return null;
  }

  async getProductByQuantity(
    productId: Types.ObjectId,
    quantity: number,
  ): Promise<ProductDoc> {
    const product = await this.findOne({
      filter: { _id: productId, stock: { $gte: quantity } },
    });
    if (!product) {
      throw new NotFoundException('Product not found or not enough quantity');
    }
    return product;
  }
}
