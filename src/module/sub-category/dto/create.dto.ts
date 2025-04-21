import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { createCategoryDto } from 'src/module/category/dto/create.dto';

export class createSubCategoryDto extends createCategoryDto {
  @IsMongoId()
  categoryId: Types.ObjectId;
}
