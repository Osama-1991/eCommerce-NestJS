import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  imports: [],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {
  /* 
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HeaderValidateMiddleware)
      .exclude(
        {
          path: 'category/get-category/:categoryId',
          method: RequestMethod.GET,
        },
        { path: 'category/get-all-category', method: RequestMethod.GET },
        { path: 'category/get-products', method: RequestMethod.GET },
        {
          path: 'category/:categoryId/getSubCategory/:subCategoryId',
          method: RequestMethod.GET,
        },
        {
          path: 'category/:categoryId/get-all-sub-category',
          method: RequestMethod.GET,
        },
        {
          path: 'category/:categoryId/:subCategoryId/get-products',
          method: RequestMethod.GET,
        },
        {
          path: 'category/:categoryId/:subCategoryId/get-product-by-id/:productId',
          method: RequestMethod.GET,
        },
      )
      .forRoutes('category');
  }
  */
}
