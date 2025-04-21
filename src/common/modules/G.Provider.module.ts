import { Global, Module } from '@nestjs/common';
import {
  BrandModel,
  CategoryModel,
  ProductModel,
  SubCategoryModel,
  BrandRepositoryService,
  CategoryRepositoryService,
  ProductRepositoryService,
  SubCategoryRepositoryService,
  VendorSalesRepositoryService,
  vendorSalesModel,
} from 'src/DB/z_index';

@Global()
@Module({
  imports: [
    ProductModel,
    CategoryModel,
    SubCategoryModel,
    BrandModel,
    vendorSalesModel,
  ],
  providers: [
    CategoryRepositoryService,
    SubCategoryRepositoryService,
    ProductRepositoryService,
    BrandRepositoryService,
    VendorSalesRepositoryService,
  ],
  exports: [
    ProductModel,
    CategoryModel,
    SubCategoryModel,
    BrandModel,
    vendorSalesModel,
    CategoryRepositoryService,
    SubCategoryRepositoryService,
    ProductRepositoryService,
    BrandRepositoryService,
    VendorSalesRepositoryService,
  ],
})
export class GlobalProviderModule {}
