import { Type } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';
import { IProductQuantity } from 'src/DB/z_index';

export class createCartDto implements IProductQuantity {
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  quantity: number;
}
