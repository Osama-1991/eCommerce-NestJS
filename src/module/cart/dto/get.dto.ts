import { Type } from 'class-transformer';
import { IsMongoId, Validate } from 'class-validator';
import { Types } from 'mongoose';
import { CheckMongoIds } from 'src/common/pipes/custom.validator.checkMongoIds';

export class ICartIdDto {
  @IsMongoId()
  @Type(() => Types.ObjectId)
  cartId: Types.ObjectId;
}

export class IProductIdCartDto {
  @IsMongoId()
  @Type(() => Types.ObjectId)
  productId: Types.ObjectId;
}

export class IItemsIdsDto {
  @Validate(CheckMongoIds)
  productIds: Types.ObjectId[];
}
