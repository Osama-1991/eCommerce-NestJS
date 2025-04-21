import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ICategoryInput } from 'src/DB/z_index';

export class createCategoryDto implements ICategoryInput {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;
}
