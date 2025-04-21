import { IsOptional, IsString, MinLength } from 'class-validator';
import { queryPaginationDto } from 'src/common/z_index';

export class findCategoryDto extends queryPaginationDto {
  @IsOptional()
  @MinLength(1)
  @IsString()
  name?: string;
}
