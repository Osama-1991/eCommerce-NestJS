import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { Auth, User } from 'src/common/z_index';
import { CouponIdDto, CreateCouponDto } from './dto/create.dto';
import { UpdateCouponDto } from './dto/update.dto';
import { IUser, RoleTypes } from '../../DB/z_index';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Auth([RoleTypes.admin])
  @Post('create-coupon')
  async create(@User() user: IUser, @Body() createCouponDto: CreateCouponDto) {
    return await this.couponService.create(user, createCouponDto);
  }
  @Auth([RoleTypes.admin])
  @Get('get-coupon')
  async findAll(@User() user: IUser) {
    return await this.couponService.findAll(user);
  }

  @Get(':id')
  async findOne(@Param() params: CouponIdDto) {
    return await this.couponService.findOne(params);
  }
  @Auth([RoleTypes.admin])
  @Patch('update-coupon')
  async update(@User() user: IUser, @Body() body: UpdateCouponDto) {
    return await this.couponService.update(user, body);
  }

  @Auth([RoleTypes.admin])
  @Delete('delete-coupon')
  async remove(@User() user: IUser, @Body() body: CouponIdDto) {
    return await this.couponService.remove(user, body);
  }
}
