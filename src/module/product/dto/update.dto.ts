import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  Category_SubCategoryId_BrandId,
  CategoryImagesDto,
} from './create.dto';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { Color, Size } from 'src/DB/z_index';

export class ProductIdDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: Types.ObjectId;
}

export class GetProductIdDto extends Category_SubCategoryId_BrandId {
  @IsMongoId()
  @IsNotEmpty()
  productId: Types.ObjectId;
}

export class UpdateCategoryImagesDto extends CategoryImagesDto {
  @IsArray()
  @IsOptional()
  mainImage: Express.Multer.File[];
}

export class UpdateProductDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @IsOptional()
  name?: string;
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @IsOptional()
  description?: string;
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  stock?: number;
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  @IsPositive()
  @IsOptional()
  rate?: number;
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  originalPrice?: number;
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Min(0)
  @Max(100)
  discountPercent?: number;
  @IsArray()
  @IsEnum(Size)
  @IsOptional()
  size?: Size[];
  @IsArray()
  @IsEnum(Color)
  @IsOptional()
  color?: Color[] | undefined;
  @IsMongoId()
  @IsNotEmpty()
  productId: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  @Type(() => Types.ObjectId)
  brandId?: Types.ObjectId;
}
