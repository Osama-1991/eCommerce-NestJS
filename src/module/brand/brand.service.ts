import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IAttachmentType,
  BrandRepositoryService,
  CategoryRepositoryService,
  IBrand,
  IUser,
  RoleTypes,
} from 'src/DB/z_index';
import {
  CodeGenerator,
  UploadCloudFileService,
  BrandPathFolder,
} from 'src/common/z_index';

import { createBrandDto } from './dto/create.dto';
import { brandId, updateBrandDto, updateLogoDto } from './dto/update.dto';

@Injectable()
export class BrandService {
  constructor(
    private readonly categoryRepositoryService: CategoryRepositoryService,
    private readonly brandRepositoryService: BrandRepositoryService,
    private readonly uploadCloudFileService: UploadCloudFileService,
  ) {}

  async create(
    file: Express.Multer.File,
    body: createBrandDto,
    user: IUser,
  ): Promise<IBrand> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const { name, categoryId } = body;
    const category =
      await this.categoryRepositoryService.checkCategoryExistsById(categoryId);
    await this.brandRepositoryService.checkDuplicateBrandName({
      name,
    });
    const codeG = new CodeGenerator(6);
    const folderId: string = codeG.generateWithNumbers();
    const folder: string = BrandPathFolder({
      categoryFolderId: category.folderId,
      folderId,
    });
    const logo: IAttachmentType =
      await this.uploadCloudFileService.uploadSingleFile(file.path, {
        folder,
      });
    const brand = await this.brandRepositoryService.create({
      name,
      createdBy: user._id,
      logo,
      folderId,
      categoryId,
    });

    return brand;
  }

  async update(user: IUser, body: updateBrandDto): Promise<IBrand | null> {
    if (!body || Object.keys(body).length == 0) {
      throw new BadRequestException('cannot send empty body');
    }
    if (body.categoryId) {
      await this.categoryRepositoryService.checkCategoryExistsById(
        body.categoryId,
      );
    }

    const { brandId, name, categoryId } = body;
    await this.brandRepositoryService.checkDuplicateBrandName({ name });
    let brand = await this.brandRepositoryService.findById({
      id: brandId,
    });

    if (!brand) {
      throw new BadRequestException('Brand not found');
    }

    if (user.role !== RoleTypes.superAdmin && brand?.createdBy !== user._id) {
      throw new BadRequestException('you cannot update brand ');
    }

    brand = await this.brandRepositoryService.findByIdAndUpdate({
      id: brandId,
      update: { name, updatedBy: user._id, categoryId },
    });

    return brand;
  }

  async updateLogo(
    file: Express.Multer.File,
    user: IUser,
    body: updateLogoDto,
  ): Promise<IBrand> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const { brandId, categoryId } = body;
    const category =
      await this.categoryRepositoryService.checkCategoryExistsById(categoryId);
    const brand = await this.brandRepositoryService.findById({
      id: brandId,
    });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    if (user.role !== RoleTypes.superAdmin && brand.createdBy !== user._id) {
      throw new BadRequestException('you cannot update logo ');
    }

    if (brand.logo.public_id) {
      await this.uploadCloudFileService.deleteFileByPublicId(
        brand.logo.public_id,
      );
    }
    const folder: string = BrandPathFolder({
      categoryFolderId: category.folderId,
      folderId: brand.folderId,
    });
    const logo = await this.uploadCloudFileService.uploadSingleFile(file.path, {
      folder,
    });
    brand.logo = logo;
    await brand.save();
    return brand;
  }

  async deleteBrand(user: IUser, body: brandId): Promise<{ message: string }> {
    const { brandId } = body;
    const brand = await this.brandRepositoryService.findById({
      id: brandId,
    });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    const category =
      await this.categoryRepositoryService.checkCategoryExistsById(
        brand.categoryId,
      );

    if (user.role !== RoleTypes.superAdmin && brand.createdBy !== user._id) {
      throw new BadRequestException('you cannot delete brand ');
    }
    const folder: string = BrandPathFolder({
      categoryFolderId: category.folderId,
      folderId: brand.folderId,
    });

    await this.uploadCloudFileService.deleteFileByPrefix(folder);
    await this.brandRepositoryService.deleteOne({
      filter: {
        _id: brandId,
      },
    });

    return { message: 'brands deleted successfully' };
  }
}
