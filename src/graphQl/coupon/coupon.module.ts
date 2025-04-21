import { Module } from '@nestjs/common';
import { CouponResolver } from './coupon.resolver';
import { CouponService } from 'src/module/coupon/coupon.service';
import { CouponModel, CouponRepositoryService } from 'src/DB/z_index';

@Module({
  imports: [CouponModel],
  providers: [CouponResolver, CouponService, CouponRepositoryService],
})
export class CouponModule {}
