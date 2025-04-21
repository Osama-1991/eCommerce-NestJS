import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CategoryRepositoryService,
  SubCategoryRepositoryService,
  IAttachmentType,
  IPagination,
  IUser,
  ISubCategory,
  RoleTypes,
} from 'src/DB/z_index';
import { createSubCategoryDto } from './dto/create.dto';
import {
  CodeGenerator,
  UploadCloudFileService,
  SubCategoryPathFolder,
} from 'src/common/z_index';
import {
  CategoryAndSubCategoryId,
  SubCategoryIdDto,
  updateSubCategoryDto,
} from './dto/update.dto';
import { CategoryIdDto } from '../category/dto/update.dto';
import { findCategoryDto } from '../category/dto/get.dto';
import { FilterQuery } from 'mongoose';

@Injectable()
export class SubCategoryService {
  constructor(
    private readonly subCategoryRepositoryService: SubCategoryRepositoryService,
    private readonly categoryRepositoryService: CategoryRepositoryService,
    private readonly uploadCloudFileService: UploadCloudFileService,
  ) {}

  async create(
    image: Express.Multer.File,
    body: createSubCategoryDto,
    user: IUser,
  ): Promise<ISubCategory> {
    if (!image) {
      throw new BadRequestException('No file uploaded');
    }
    const { categoryId, name } = body;
    const category =
      await this.categoryRepositoryService.checkCategoryExistsById(categoryId);

    await this.subCategoryRepositoryService.checkDuplicateSubCategoryName({
      name,
      categoryId,
    });

    const codeG = new CodeGenerator(6);
    const folderId: string = codeG.generateWithNumbers();
    const folder: string = SubCategoryPathFolder({
      categoryFolderId: category.folderId,
      folderId,
    });
    const logo: IAttachmentType =
      await this.uploadCloudFileService.uploadSingleFile(image.path, {
        folder,
      });
    const subCategory: ISubCategory =
      await this.subCategoryRepositoryService.create({
        ...body,
        categoryId,
        createdBy: user._id,
        logo,
        folderId,
      });

    return subCategory;
  }

  async update(user: IUser, body: updateSubCategoryDto): Promise<ISubCategory> {
    const { name, subCategoryId } = body;
    if (!name) {
      throw new BadRequestException('cannot send empty body');
    }

    let subCategory = await this.subCategoryRepositoryService.findById({
      id: subCategoryId,
    });
    if (!subCategory) {
      throw new NotFoundException('Subcategory not found');
    }

    if (
      subCategory?.createdBy.toString() !== user._id?.toString() &&
      user.role !== RoleTypes.superAdmin
    ) {
      throw new BadRequestException('you cannot update subCategory ');
    }

    subCategory = await this.subCategoryRepositoryService.findByIdAndUpdate({
      id: subCategoryId,
      update: { name, updatedBy: user._id },
    });

    if (!subCategory) {
      throw new NotFoundException('Subcategory not found');
    }

    return subCategory;
  }

  async updateLogo(
    image: Express.Multer.File,
    user: IUser,
    body: SubCategoryIdDto,
  ): Promise<ISubCategory> {
    if (!image) {
      throw new BadRequestException('No file uploaded');
    }

    const { subCategoryId } = body;

    const subCategory = await this.subCategoryRepositoryService.findById({
      id: subCategoryId,
    });

    if (!subCategory) {
      throw new NotFoundException('Subcategory  not found');
    }

    if (
      subCategory?.createdBy.toString() !== user._id?.toString() &&
      user.role !== RoleTypes.superAdmin
    ) {
      throw new BadRequestException('you cannot update subCategory image');
    }

    const category = await this.categoryRepositoryService.findOne({
      filter: { _id: subCategory.categoryId, createdBy: user._id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (subCategory.logo.public_id) {
      await this.uploadCloudFileService.deleteFileByPublicId(
        subCategory.logo.public_id,
      );
    }

    const folder: string = SubCategoryPathFolder({
      categoryFolderId: category.folderId,
      folderId: subCategory.folderId,
    });
    const logo = await this.uploadCloudFileService.uploadSingleFile(
      image.path,
      {
        folder,
      },
    );
    subCategory.logo = logo;
    await subCategory.save();
    return subCategory;
  }

  async deleteSubCategory(
    user: IUser,
    body: SubCategoryIdDto,
  ): Promise<{ message: string }> {
    const { subCategoryId } = body;
    const subCategory = await this.subCategoryRepositoryService.findById({
      id: subCategoryId,
    });

    if (!subCategory) {
      throw new NotFoundException('Subcategory not found');
    }

    if (
      subCategory?.createdBy.toString() !== user._id?.toString() &&
      user.role !== RoleTypes.superAdmin
    ) {
      throw new BadRequestException('you cannot delete subCategory ');
    }

    const category = await this.categoryRepositoryService.findById({
      id: subCategory.categoryId,
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.subCategoryRepositoryService.deleteSubCategory(
      user,
      subCategoryId,
      category.folderId,
    );

    return { message: 'Delete Sub Category successfully' };
  }

  async getById(params: CategoryAndSubCategoryId): Promise<ISubCategory> {
    const { categoryId, subCategoryId } = params;
    const subCategory =
      await this.subCategoryRepositoryService.checkSubCategoryExists(
        {
          _id: subCategoryId,
          categoryId,
        },
        [
          {
            path: 'categoryId',
          },
        ],
      );

    return subCategory;
  }

  async getAll(
    query: findCategoryDto,
    params: CategoryIdDto,
  ): Promise<IPagination<ISubCategory>> {
    const { categoryId } = params;

    await this.categoryRepositoryService.checkCategoryExistsById(categoryId);
    const { page, limit, sort, select } = query;

    let filter: FilterQuery<ISubCategory> = {};

    if (query?.name) {
      filter = {
        $or: [
          { name: { $regex: query.name, $options: 'i' } },
          { slug: { $regex: query.name, $options: 'i' } },
        ],
      };
    }

    const subCategories = await this.subCategoryRepositoryService.pagination({
      page,
      limit,
      filter,
      sort,
      select,
      populate: [
        {
          path: 'categoryId',
        },
        {
          path: 'createdBy',
        },
      ],
    });
    return subCategories;
  }
}
