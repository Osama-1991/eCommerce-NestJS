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
import { CategoryService } from './category.service';
import { Auth, User, MulterCloudOption, fileFormat } from 'src/common/z_index';
import { FileInterceptor } from '@nestjs/platform-express';
import { IUser, RoleTypes } from '../../DB/z_index';
import { createCategoryDto } from './dto/create.dto';
import { CategoryIdDto, updateCategoryDto } from './dto/update.dto';
import { findCategoryDto } from './dto/get.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Auth([RoleTypes.admin, RoleTypes.superAdmin])
  @UseInterceptors(
    FileInterceptor(
      'image',
      MulterCloudOption({
        fileValidator: fileFormat.image,
      }),
    ),
  )
  @Post('create-category')
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: createCategoryDto,
    @User() user: IUser,
  ) {
    return await this.categoryService.create(image, body, user);
  }

  @Post('get-category-by-name')
  async getCategoryByName(@Query() query: { name: string }) {
    return await this.categoryService.getCategoryByName(query.name);
  }

  @Auth([RoleTypes.admin, RoleTypes.superAdmin])
  @Patch('update-category')
  async update(@User() user: IUser, @Body() body: updateCategoryDto) {
    return await this.categoryService.update(user, body);
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
  @Patch('update-category-logo')
  async updateLogo(
    @UploadedFile() image: Express.Multer.File,
    @User() user: IUser,
    @Body() body: CategoryIdDto,
  ) {
    return await this.categoryService.updateLogo(image, user, body);
  }

  @Auth([RoleTypes.admin, RoleTypes.superAdmin])
  @Delete('delete-category')
  async deleteCategory(@User() user: IUser, @Body() body: CategoryIdDto) {
    return await this.categoryService.delete(user, body);
  }

  @Get('get-category/:categoryId')
  async getCategoryById(@Param() params: CategoryIdDto) {
    return await this.categoryService.getById(params);
  }

  @Get('get-all-category')
  async getAllCategory(@Query() filter: findCategoryDto) {
    return await this.categoryService.getAll(filter);
  }
}
