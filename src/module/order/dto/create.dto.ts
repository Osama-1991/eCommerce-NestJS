import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';
import { IOrderInput, PaymentWayType } from 'src/DB/z_index';

export class CreateOrderDto implements IOrderInput {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  address: string;
  @Matches(/^(002|\+2)?01[0125][0-9]{8}$/)
  phone: string;
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  @IsOptional()
  note?: string;
  @IsString()
  @IsEnum(PaymentWayType)
  paymentWay: PaymentWayType;
  @IsMongoId()
  @IsOptional()
  couponId?: Types.ObjectId;
}
