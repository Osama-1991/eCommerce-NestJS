import { IsMongoId, IsOptional, IsString, Length } from 'class-validator';
import { Types } from 'mongoose';

export class CategoryIdDto {
  @IsMongoId()
  categoryId: Types.ObjectId;
}

export class updateCategoryDto extends CategoryIdDto {
  @IsString()
  @Length(1, 50)
  @IsOptional()
  name: string;
}
