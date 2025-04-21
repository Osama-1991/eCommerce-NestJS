import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { IQuery } from 'src/DB/z_index';

export class queryPaginationDto implements IQuery {
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Min(0)
  @Type(() => Number)
  page?: number;
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Min(0)
  @Type(() => Number)
  limit?: number;
  @IsString()
  @MinLength(2)
  @IsOptional()
  sort?: string;
  @IsString()
  @MinLength(2)
  @IsOptional()
  select?: string;
}
