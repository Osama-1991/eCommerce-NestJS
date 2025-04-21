import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import {
  BrandRepositoryService,
  ReviewRepositoryService,
  BrandModel,
  ReviewModel,
} from 'src/DB/z_index';

@Module({
  imports: [BrandModel, ReviewModel],
  controllers: [ProductController],
  providers: [ProductService, BrandRepositoryService, ReviewRepositoryService],
})
export class ProductModule {}
