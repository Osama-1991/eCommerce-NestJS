import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CouponRepositoryService,
  IUser,
  ICoupon,
  RoleTypes,
} from 'src/DB/z_index';
import { CouponIdDto, CreateCouponDto } from './dto/create.dto';
import { UpdateCouponDto } from './dto/update.dto';

@Injectable()
export class CouponService {
  constructor(
    private readonly couponRepositoryService: CouponRepositoryService,
  ) {}
  async create(user: IUser, body: CreateCouponDto): Promise<ICoupon> {
    const { code, fromDate, toDate, amount } = body;
    await this.couponRepositoryService.checkCouponCodeExist(code);
    const coupon = await this.couponRepositoryService.create({
      code,
      fromDate,
      toDate,
      amount,
      createdBy: user._id,
    });
    return coupon;
  }

  async findAll(user: IUser): Promise<ICoupon[]> {
    const coupons = await this.couponRepositoryService.find({
      filter: {
        createdBy: user._id,
      },
    });
    if (!coupons) {
      throw new NotFoundException('No coupons found');
    }
    return coupons;
  }

  async findOne(params: CouponIdDto): Promise<ICoupon> {
    const { couponId } = params;
    const coupon = await this.couponRepositoryService.findById({
      id: couponId,
    });
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    return coupon;
  }

  async update(user: IUser, body: UpdateCouponDto): Promise<ICoupon> {
    const { couponId, amount } = body;
    if (!amount) {
      throw new BadRequestException('cannot send empty body');
    }
    const coupon = await this.couponRepositoryService.findById({
      id: couponId,
      // update: { amount },
    });
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    if (user.role !== RoleTypes.superAdmin || coupon.createdBy !== user._id) {
      throw new BadRequestException('you cannot update coupon ');
    }

    coupon.amount = amount;
    await coupon.save();

    return coupon;
  }

  async remove(user: IUser, body: CouponIdDto): Promise<{ message: string }> {
    const { couponId } = body;
    const coupon = await this.couponRepositoryService.findById({
      id: couponId,
    });
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    if (user.role !== RoleTypes.superAdmin || coupon.createdBy !== user._id) {
      throw new BadRequestException('you cannot remove coupon ');
    }
    await this.couponRepositoryService.deleteOne({ filter: { _id: couponId } });

    return {
      message: `Coupon id : ${coupon._id.toString()} deleted successfully`,
    };
  }
}
