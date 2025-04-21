import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
  Validate,
} from 'class-validator';
import { Types } from 'mongoose';
import {
  CheckToDateIsAfterFutureConstraint,
  CheckFromDateIsInFutureConstraint,
} from 'src/common/z_index';

export class CouponIdDto {
  @IsMongoId()
  couponId: Types.ObjectId;
}

export class CreateCouponDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @IsNotEmpty()
  @Min(1)
  @Max(100)
  amount: number;
  @IsString()
  @Length(1, 10)
  @IsNotEmpty()
  code: string;

  @Type(() => Date)
  @IsNotEmpty()
  @Validate(CheckFromDateIsInFutureConstraint)
  fromDate: Date;

  @Type(() => Date)
  @IsNotEmpty()
  @Validate(CheckToDateIsAfterFutureConstraint)
  toDate: Date;
}
