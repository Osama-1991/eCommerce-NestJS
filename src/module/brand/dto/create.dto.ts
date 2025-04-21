import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';
import { ICategoryInput } from 'src/DB/z_index';

export class createBrandDto implements ICategoryInput {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name: string;
  @IsMongoId()
  categoryId: Types.ObjectId;
}
