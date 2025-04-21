import {
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';

export class brandId {
  @IsMongoId()
  brandId: Types.ObjectId;
}
export class updateLogoDto extends brandId {
  @IsMongoId()
  categoryId: Types.ObjectId;
}

export class updateBrandDto extends brandId {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  name: string;
  @IsMongoId()
  @IsOptional()
  categoryId: Types.ObjectId;
}
