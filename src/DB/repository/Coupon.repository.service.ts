import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DBRepository } from './mainRepository/DB.Repository';
import { Coupon, CouponDoc } from '../model/coupon.model';

@Injectable()
export class CouponRepositoryService extends DBRepository<CouponDoc> {
  constructor(
    @InjectModel(Coupon.name)
    private couponModel: Model<CouponDoc>,
  ) {
    super(couponModel);
  }

  async checkCouponCodeExist(name: string): Promise<null> {
    const couponExist = await this.findOne({ filter: { code: name } });
    if (couponExist) {
      throw new ConflictException('coupon already Exist');
    }
    return null;
  }
}
