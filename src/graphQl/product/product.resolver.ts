import { Args, Query, Resolver } from '@nestjs/graphql';
import { Auth, User } from 'src/common/z_index';
import { IUser, RoleTypes } from 'src/DB/z_index';
import {
  filterProductsDto,
  PaginationProductsResponse,
} from './entities/product.entity';
import { ProductService } from 'src/module/product/product.service';

@Resolver()
export class productResolve {
  constructor(private readonly productService: ProductService) {}

  @Auth([
    RoleTypes.user,
    RoleTypes.vendor,
    RoleTypes.admin,
    RoleTypes.superAdmin,
  ])
  @Query(() => PaginationProductsResponse, { name: 'ProductList' })
  productList(
    @User() user: IUser,
    @Args('filterProduct') query: filterProductsDto,
  ) {
    const param = {
      categoryId: query.categoryId,
      subCategoryId: query.subCategoryId,
    };
    return this.productService.getAllProductsBySubCategory(query, param);
  }
}
