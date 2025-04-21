import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { DBRepository } from './mainRepository/DB.Repository';
import { Brand, BrandyDoc } from '../model/brand.model';

@Injectable()
export class BrandRepositoryService extends DBRepository<BrandyDoc> {
  constructor(
    @InjectModel(Brand.name)
    private BrandModel: Model<BrandyDoc>,
  ) {
    super(BrandModel);
  }
  async checkDuplicateBrandName(data: FilterQuery<BrandyDoc>): Promise<null> {
    const checkBrand = await this.findOne({
      filter: data,
    });
    if (checkBrand) {
      throw new ConflictException('Brand name already exists');
    }
    return null;
  }

  async checkCategoryExistsById(id: Types.ObjectId): Promise<BrandyDoc> {
    const brandExists = await this.findById({ id });
    if (!brandExists) {
      throw new NotFoundException('Brand does not exist');
    }
    return brandExists;
  }
  async checkBrandExists(data: FilterQuery<BrandyDoc>): Promise<BrandyDoc> {
    const brandExists = await this.findOne({
      filter: data,
    });
    if (!brandExists) {
      throw new NotFoundException('Brand does not exist');
    }
    return brandExists;
  }
}
