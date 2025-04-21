import { Module } from '@nestjs/common';
import { ProductService } from 'src/module/product/product.service';
import { productResolve } from './product.resolver';
import {
  BrandModel,
  BrandRepositoryService,
  ReviewModel,
  ReviewRepositoryService,
} from 'src/DB/z_index';

@Module({
  imports: [BrandModel, ReviewModel],

  providers: [
    productResolve,
    ProductService,
    BrandRepositoryService,
    ReviewRepositoryService,
  ],
})
export class ProductModule {}
