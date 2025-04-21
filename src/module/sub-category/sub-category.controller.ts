import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { Auth, User, MulterCloudOption, fileFormat } from 'src/common/z_index';
import { IPagination, IUser, RoleTypes, ISubCategory } from 'src/DB/z_index';
import { FileInterceptor } from '@nestjs/platform-express';
import { createSubCategoryDto } from './dto/create.dto';
import {
  CategoryAndSubCategoryId,
  SubCategoryIdDto,
  updateSubCategoryDto,
} from './dto/update.dto';
import { CategoryIdDto } from '../category/dto/update.dto';
import { findCategoryDto } from '../category/dto/get.dto';

@Controller('category')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Auth([RoleTypes.admin, RoleTypes.superAdmin])
  @UseInterceptors(
    FileInterceptor(
      'image',
      MulterCloudOption({
        fileValidator: fileFormat.image,
      }),
    ),
  )
  @Post('create-sub-category')
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: createSubCategoryDto,
    @User() user: IUser,
  ): Promise<ISubCategory> {
    return await this.subCategoryService.create(image, body, user);
  }

  @Auth([RoleTypes.admin, RoleTypes.superAdmin])
  @Patch('update-sub-category')
  async update(@User() user: IUser, @Body() body: updateSubCategoryDto) {
    return await this.subCategoryService.update(user, body);
  }

  @Auth([RoleTypes.admin, RoleTypes.superAdmin])
  @UseInterceptors(
    FileInterceptor(
      'image',
      MulterCloudOption({
        fileValidator: fileFormat.image,
      }),
    ),
  )
  @Patch('update-sub-category-logo')
  async updateSubCategoryLogo(
    @UploadedFile() image: Express.Multer.File,
    @User() user: IUser,
    @Body() body: SubCategoryIdDto,
  ): Promise<ISubCategory> {
    return await this.subCategoryService.updateLogo(image, user, body);
  }

  @Auth([RoleTypes.admin, RoleTypes.superAdmin])
  @Delete('delete-sub-category')
  async deleteSubCategory(@User() user: IUser, @Body() body: SubCategoryIdDto) {
    return await this.subCategoryService.deleteSubCategory(user, body);
  }

  @Get(':categoryId/getSubCategory/:subCategoryId')
  async getSubCategoryById(
    @Param() params: CategoryAndSubCategoryId,
  ): Promise<ISubCategory> {
    return await this.subCategoryService.getById(params);
  }

  @Get(':categoryId/get-all-sub-category')
  async getAllCategory(
    @Query() filter: findCategoryDto,
    @Param() params: CategoryIdDto,
  ): Promise<IPagination<ISubCategory>> {
    return await this.subCategoryService.getAll(filter, params);
  }
}
