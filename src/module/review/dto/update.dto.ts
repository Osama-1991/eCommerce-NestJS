import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class UpdateReviewDto {
  @IsString()
  @MinLength(2)
  @MaxLength(2000)
  @IsOptional()
  text: string;
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating: number;
}

export class GetReviewIdDto {
  @IsMongoId()
  @Type(() => Types.ObjectId)
  reviewId: Types.ObjectId;
}
