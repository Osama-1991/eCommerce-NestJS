import { Resolver } from '@nestjs/graphql';
import { CouponService } from 'src/module/coupon/coupon.service';

@Resolver()
export class CouponResolver {
  constructor(private readonly couponService: CouponService) {}
}
