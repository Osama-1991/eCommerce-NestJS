import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth, User, fileFormat, MulterCloudOption } from 'src/common/z_index';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateProductDto, CreateProductFilesDto } from './dto/create.dto';
import {
  ProductIdDto,
  UpdateCategoryImagesDto,
  UpdateProductDto,
} from './dto/update.dto';
import { getProductsQueryDto, productId } from './dto/get.dto';
import { CategoryAndSubCategoryId } from '../sub-category/dto/update.dto';
import { IUser, RoleTypes, IProduct } from '../../DB/z_index';

@Controller('category')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Auth([RoleTypes.vendor])
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainImage', maxCount: 1 },
        { name: 'images', maxCount: 3 },
      ],
      MulterCloudOption({
        fileValidator: fileFormat.image,
      }),
    ),
  )
  @Post('/addProduct')
  create(
    @User() user: IUser,
    @Body() body: CreateProductDto,
    @UploadedFiles() files: CreateProductFilesDto,
  ): Promise<IProduct> {
    return this.productService.create(user, body, files);
  }

  @Auth([RoleTypes.vendor])
  @Patch('update-product')
  async update(
    @User() user: IUser,
    @Body() body: UpdateProductDto,
  ): Promise<IProduct> {
    return await this.productService.updateProduct(user, body);
  }

  @Auth([RoleTypes.vendor])
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainImage', maxCount: 1 },
        { name: 'images', maxCount: 3 },
      ],
      MulterCloudOption({
        fileValidator: fileFormat.image,
      }),
    ),
  )
  @Patch('update-product-images')
  async updateProductImages(
    @User() user: IUser,
    @Body() body: ProductIdDto,
    @UploadedFiles() files: UpdateCategoryImagesDto,
  ) {
    return await this.productService.updateProductImgs(user, body, files);
  }

  @Auth([RoleTypes.vendor])
  @Delete('delete-product')
  async deleteProduct(@User() user: IUser, @Body() body: ProductIdDto) {
    return await this.productService.deleteProduct(user, body);
  }

  @Get('get-products')
  async getAllProducts(@Query() query: getProductsQueryDto) {
    return await this.productService.getAllProducts(query);
  }

  @Get(':categoryId/:subCategoryId/get-products')
  async getAllProductsBySubCategory(
    @Query() query: getProductsQueryDto,
    @Param() params: CategoryAndSubCategoryId,
  ) {
    return await this.productService.getAllProductsBySubCategory(query, params);
  }

  @Get(':categoryId/:subCategoryId/get-product-by-id/:productId')
  async getProductById(@Param() params: productId) {
    return await this.productService.getProductById(params);
  }
}
