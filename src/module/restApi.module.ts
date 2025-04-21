import { Module } from '@nestjs/common';
import {
  UserModule,
  CategoryModule,
  ProductModule,
  SubCategoryModule,
  BrandModule,
  CartModule,
  OrderModule,
  CouponModule,
  ReviewModule,
  AuthModule,
} from './z_index';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CategoryModule,
    SubCategoryModule,
    BrandModule,
    ProductModule,
    ReviewModule,
    CartModule,
    OrderModule,
    CouponModule,
  ],
  providers: [],
  exports: [
    AuthModule,
    UserModule,
    CategoryModule,
    SubCategoryModule,
    BrandModule,
    ProductModule,
    ReviewModule,
    CartModule,
    OrderModule,
    CouponModule,
  ],
})
export class RestApiModule {}
