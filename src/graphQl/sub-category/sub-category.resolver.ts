import { Args, Query, Resolver } from '@nestjs/graphql';
import { Auth, User } from 'src/common/z_index';
import { IUser, RoleTypes } from 'src/DB/z_index';
import { SubCategoryService } from 'src/module/sub-category/sub-category.service';
import {
  filterSubCategoryDto,
  PaginationSubCategoryResponse,
} from './entities/subCategory.entity';

@Resolver()
export class SubCategoryResolver {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Auth([
    RoleTypes.user,
    RoleTypes.vendor,
    RoleTypes.admin,
    RoleTypes.superAdmin,
  ])
  @Query(() => PaginationSubCategoryResponse, { name: 'SubCategoryList' })
  subCategoryList(
    @User() user: IUser,
    @Args('subCategoryFilter') query: filterSubCategoryDto,
  ) {
    const param = {
      categoryId: query.categoryId,
    };
    return this.subCategoryService.getAll(query, param);
  }
}
