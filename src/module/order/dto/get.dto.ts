import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class OrderIdDto {
  @IsMongoId()
  orderId: Types.ObjectId;
}
