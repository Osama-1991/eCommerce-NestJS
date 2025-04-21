import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  UploadCloudFileService,
  CodeGenerator,
  CategoryPathFolder,
} from 'src/common/z_index';
import {
  CategoryRepositoryService,
  IPagination,
  IAttachmentType,
  ICategory,
  IUser,
  RoleTypes,
} from 'src/DB/z_index';
import { createCategoryDto } from './dto/create.dto';
import { CategoryIdDto, updateCategoryDto } from './dto/update.dto';
import { findCategoryDto } from './dto/get.dto';
import { FilterQuery } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepositoryService: CategoryRepositoryService,
    private readonly uploadCloudFileService: UploadCloudFileService,
  ) {}
  async create(
    image: Express.Multer.File,
    body: createCategoryDto,
    user: IUser,
  ): Promise<ICategory> {
    if (!image) {
      throw new BadRequestException('No file uploaded');
    }
    const { name } = body;
    await this.categoryRepositoryService.checkDuplicateCategoryName({
      name,
    });
    const codeG = new CodeGenerator(6);
    const folderId: string = codeG.generateWithNumbers();
    const folder: string = CategoryPathFolder({ folderId });
    const logo: IAttachmentType =
      await this.uploadCloudFileService.uploadSingleFile(image.path, {
        folder,
      });

    const category = await this.categoryRepositoryService.create({
      name,
      logo,
      createdBy: user._id,
      folderId,
    });
    return category;
  }

  async getCategoryByName(name: string): Promise<ICategory> {
    const category = await this.categoryRepositoryService.checkCategoryExists({
      name,
    });
    return category;
  }

  async update(
    user: IUser,
    body: updateCategoryDto,
  ): Promise<ICategory | null> {
    const { name, categoryId } = body;
    await this.categoryRepositoryService.checkDuplicateCategoryName({
      name,
    });

    let category = await this.categoryRepositoryService.findById({
      id: categoryId,
    });

    if (!category) {
      throw new NotFoundException('Category not found or not created by user');
    }

    if (
      category?.createdBy.toString() !== user._id?.toString() &&
      user.role !== RoleTypes.superAdmin
    ) {
      throw new BadRequestException('you cannot update category  ');
    }

    category = await this.categoryRepositoryService.findByIdAndUpdate({
      id: categoryId,
      update: { name, updatedBy: user._id },
    });

    return category;
  }

  async updateLogo(
    image: Express.Multer.File,
    user: IUser,
    body: CategoryIdDto,
  ): Promise<ICategory | undefined> {
    if (!image) {
      throw new BadRequestException('No file uploaded');
    }
    const { categoryId } = body;
    const category = await this.categoryRepositoryService.findById({
      id: categoryId,
    });
    if (!category) {
      throw new NotFoundException('Category not found ');
    }

    if (
      category?.createdBy.toString() !== user._id?.toString() &&
      user.role !== RoleTypes.superAdmin
    ) {
      throw new BadRequestException('you cannot update category image ');
    }

    if (category.logo.public_id) {
      await this.uploadCloudFileService.deleteFileByPublicId(
        category.logo.public_id,
      );
      const folder: string = CategoryPathFolder({
        folderId: category.folderId,
      });

      const logo = await this.uploadCloudFileService.uploadSingleFile(
        image.path,
        {
          folder,
        },
      );
      category.logo = logo;
      await category.save();
      return category;
    }
  }

  async delete(user: IUser, body: CategoryIdDto): Promise<{ message: string }> {
    const { categoryId } = body;

    const category = await this.categoryRepositoryService.findById({
      id: categoryId,
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    if (
      category?.createdBy.toString() !== user._id?.toString() &&
      user.role !== RoleTypes.superAdmin
    ) {
      throw new BadRequestException('you cannot delete subCategory ');
    }

    await this.categoryRepositoryService.deleteCategory(user, categoryId);
    return { message: 'Category deleted successfully' };
  }

  async getById(params: CategoryIdDto): Promise<ICategory> {
    const { categoryId } = params;
    const category =
      await this.categoryRepositoryService.checkCategoryExistsById(categoryId);
    return category;
  }

  async getAll(query: findCategoryDto): Promise<IPagination<ICategory>> {
    let filter: FilterQuery<ICategory> = {};
    const { page, limit, sort, select } = query;

    if (query?.name) {
      filter = {
        $or: [
          { name: { $regex: query.name, $options: 'i' } },
          { slug: { $regex: query.name, $options: 'i' } },
        ],
      };
    }

    const categories = await this.categoryRepositoryService.pagination({
      filter,
      page,
      limit,
      sort,
      select,
      populate: [{ path: 'createdBy' }],
    });
    return categories;
  }
}
