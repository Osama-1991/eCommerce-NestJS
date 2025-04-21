import {
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';

export class SubCategoryIdDto {
  @IsMongoId()
  subCategoryId: Types.ObjectId;
}

export class updateSubCategoryDto extends SubCategoryIdDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  name: string;
}

export class CategoryAndSubCategoryId extends SubCategoryIdDto {
  @IsMongoId()
  categoryId: Types.ObjectId;
}
