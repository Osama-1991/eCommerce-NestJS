import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BrandService } from './brand.service';
import { Auth, MulterCloudOption, fileFormat, User } from 'src/common/z_index';
import { createBrandDto } from './dto/create.dto';
import { brandId, updateBrandDto, updateLogoDto } from './dto/update.dto';
import { IUser, RoleTypes } from '../../DB/z_index';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Auth([RoleTypes.admin, RoleTypes.superAdmin])
  @UseInterceptors(
    FileInterceptor(
      'image',
      MulterCloudOption({
        fileValidator: fileFormat.image,
      }),
    ),
  )
  @Post('create-brand')
  async createBrand(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: createBrandDto,
    @User() user: IUser,
  ) {
    return await this.brandService.create(file, body, user);
  }

  @Auth([RoleTypes.admin, RoleTypes.superAdmin])
  @Patch('update-brand')
  async updateBrand(@User() user: IUser, @Body() body: updateBrandDto) {
    return await this.brandService.update(user, body);
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
  @Patch('update-brand-logo')
  async updateLogo(
    @UploadedFile() file: Express.Multer.File,
    @User() user: IUser,
    @Body() body: updateLogoDto,
  ) {
    return await this.brandService.updateLogo(file, user, body);
  }

  @Auth([RoleTypes.admin, RoleTypes.superAdmin])
  @Delete('delete-brand')
  async deleteBrand(@User() user: IUser, @Body() body: brandId) {
    return await this.brandService.deleteBrand(user, body);
  }
}
