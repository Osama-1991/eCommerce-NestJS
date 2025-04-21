import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';
import { queryPaginationDto } from 'src/common/z_index';
import { CategoryAndSubCategoryId } from 'src/module/sub-category/dto/update.dto';

export class getProductsQueryDto extends queryPaginationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  minPrice?: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  maxPrice?: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  minRate?: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  maxRate?: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  minDiscount?: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  maxDiscount?: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  minStockQuantity?: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  maxStockQuantity?: number;
}

export class CategoryIdAndSubCategoryIdOptional {
  @IsMongoId()
  @IsOptional()
  subCategoryId?: Types.ObjectId;
  @IsMongoId()
  @IsOptional()
  categoryId?: Types.ObjectId;
}

class comparison {
  @IsNumber()
  @IsPositive()
  $gte: number;
  @IsNumber()
  @IsPositive()
  $lt: number;
}

export class filter {
  @IsString()
  @IsOptional()
  @MinLength(2)
  name?: string;
  rate?: comparison;
  finalPrice?: comparison;
  discountPercent?: comparison;
  stock?: comparison;
  @IsMongoId()
  @Type(() => Types.ObjectId)
  @IsOptional()
  subCategoryId?: Types.ObjectId;
  @IsMongoId()
  @Type(() => Types.ObjectId)
  @IsOptional()
  categoryId?: Types.ObjectId;
}

export class productId extends CategoryAndSubCategoryId {
  @IsMongoId()
  @Type(() => Types.ObjectId)
  productId: Types.ObjectId;
}
