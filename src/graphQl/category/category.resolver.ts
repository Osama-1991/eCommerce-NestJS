import { Args, Resolver, Query } from '@nestjs/graphql';
import { Auth, User } from 'src/common/z_index';
import { IUser, RoleTypes } from 'src/DB/z_index';
import { CategoryService } from 'src/module/category/category.service';
import {
  CategoryFilterDto,
  PaginationCategoryResponse,
} from './entities/category.entity';

@Resolver()
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Auth([
    RoleTypes.user,
    RoleTypes.vendor,
    RoleTypes.admin,
    RoleTypes.superAdmin,
  ])
  @Query(() => PaginationCategoryResponse, { name: 'CategoryList' })
  categoryList(
    @User() user: IUser,
    @Args('categoryFilter') query: CategoryFilterDto,
  ) {
    return this.categoryService.getAll(query);
  }
}
