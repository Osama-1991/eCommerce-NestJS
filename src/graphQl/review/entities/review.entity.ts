import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { IProduct, IReview, IUser } from 'src/DB/z_index';
import { oneUserResponse } from 'src/graphQl/dashboard/entities/dashboard.entity';
import { oneProductResponse } from 'src/graphQl/product/entities/product.entity';

@ObjectType()
export class oneReviewResponse implements IReview {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => oneUserResponse)
  createdBy: IUser;

  @Field(() => oneProductResponse)
  productId: IProduct;

  @Field(() => Number)
  rating: number;

  @Field(() => String)
  text: string;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}
