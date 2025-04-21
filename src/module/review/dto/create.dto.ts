import { Type } from 'class-transformer';
import {
  IsNumber,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { IReview } from 'src/DB/z_index';

export class CreateReviewDto implements Partial<IReview> {
  @IsString()
  @MinLength(2)
  @MaxLength(2000)
  text: string;
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  @Min(0)
  @Max(5)
  rating: number;
}
