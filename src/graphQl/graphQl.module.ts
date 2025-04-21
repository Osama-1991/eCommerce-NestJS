import { Module } from '@nestjs/common';
import { DashboardModule } from './dashboard/dashboard.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { CouponModule } from './coupon/coupon.module';
import { CartModule } from './cart/cart.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { BrandModule } from './brand/brand.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    DashboardModule,
    OrderModule,
    ProductModule,
    ReviewModule,
    CategoryModule,
    SubCategoryModule,
    CouponModule,
    CartModule,
    BrandModule,
  ],
  providers: [],
  exports: [
    GraphQLModule,
    DashboardModule,
    OrderModule,
    ProductModule,
    ReviewModule,
    CategoryModule,
    SubCategoryModule,
    CouponModule,
    CartModule,
    BrandModule,
  ],
})
export class GraphQlModule {}
