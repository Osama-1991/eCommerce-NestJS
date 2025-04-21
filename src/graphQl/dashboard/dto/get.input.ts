import { InputType, Field, ID } from '@nestjs/graphql';
import { Types } from 'mongoose';

@InputType()
export class getUserIdDto {
  @Field(() => ID, { description: 'Example field (placeholder)' })
  userId: Types.ObjectId;
}

@InputType()
export class oneProductIdDto {
  @Field(() => ID, { description: 'Example field (placeholder)' })
  productId: Types.ObjectId;
}
