import { Type } from 'class-transformer';
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
import { Types } from 'mongoose';
import { CategoryAndSubCategoryId } from 'src/module/sub-category/dto/update.dto';
import { Color, IProductInput, Size } from 'src/DB/z_index';

export class CategoryImagesDto {
  @IsArray()
  @IsOptional()
  images: Express.Multer.File[];
}

export class CreateProductFilesDto extends CategoryImagesDto {
  @IsArray()
  mainImage: Express.Multer.File[];
}

export class Category_SubCategoryId_BrandId extends CategoryAndSubCategoryId {
  @IsMongoId()
  brandId: Types.ObjectId;
}

export class CreateProductDto
  extends Category_SubCategoryId_BrandId
  implements IProductInput
{
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  @IsNotEmpty()
  name: string;
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  @IsNotEmpty()
  description: string;
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  stock: number;
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  originalPrice: number;
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  finalPrice: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  @IsPositive()
  rate: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Min(0)
  @Max(100)
  discountPercent?: number | undefined;
  @IsArray()
  @IsEnum(Size)
  @IsOptional()
  size?: Size[] | undefined;
  @IsArray()
  @IsEnum(Color)
  @IsOptional()
  color?: Color[] | undefined;
}
