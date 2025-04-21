import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions, Types } from 'mongoose';
import { DBRepository } from './mainRepository/DB.Repository';
import { Category, CategoryDoc } from '../model/z_index';
import { ProductRepositoryService } from './Product.repository.service';
import { SubCategoryRepositoryService } from './SubCategory.repository.service';
import { UploadCloudFileService, CategoryPathFolder } from 'src/common/z_index';
import { BrandRepositoryService } from './Brand.repository.service';
import { IUser } from 'src/DB/z_index';

@Injectable()
export class CategoryRepositoryService extends DBRepository<CategoryDoc> {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDoc>,
    private readonly productRepositoryService: ProductRepositoryService,
    private readonly subCategoryRepositoryService: SubCategoryRepositoryService,
    private readonly uploadCloudFileService: UploadCloudFileService,
    private readonly brandRepositoryService: BrandRepositoryService,
  ) {
    super(categoryModel);
  }

  async checkDuplicateCategoryName(
    data: FilterQuery<CategoryDoc>,
  ): Promise<null> {
    const checkCategoryName = await this.findOne({ filter: data });
    if (checkCategoryName) {
      throw new ConflictException('Category name already exists');
    }

    return null;
  }

  async checkCategoryExists(
    name: FilterQuery<CategoryDoc>,
  ): Promise<CategoryDoc> {
    const categoryExists = await this.findOne({ filter: name });
    if (!categoryExists) {
      throw new ConflictException('Category does not exist');
    }
    return categoryExists;
  }

  async checkCategoryExistsById(
    id: Types.ObjectId,
    populate: PopulateOptions[] = [],
  ): Promise<CategoryDoc> {
    const categoryExists = await this.findById({ id, populate });
    if (!categoryExists) {
      throw new NotFoundException('Category does not exist');
    }
    return categoryExists;
  }

  async deleteCategory(user: IUser, categoryId: Types.ObjectId): Promise<null> {
    const category = await this.findById({
      id: categoryId,
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    // Delete related products
    await this.productRepositoryService.deleteMany({
      filter: { categoryId },
    });
    // Delete related subcategories
    await this.subCategoryRepositoryService.deleteMany({
      filter: { categoryId },
    });

    // Delete related Brands
    await this.brandRepositoryService.deleteMany({
      filter: { categoryId },
    });
    const folder: string = CategoryPathFolder({
      folderId: category.folderId,
    });
    // Delete related images
    await this.uploadCloudFileService.deleteFileByPrefix(folder);

    await this.deleteOne({
      filter: {
        _id: categoryId,
      },
    });
    return null;
  }
}
