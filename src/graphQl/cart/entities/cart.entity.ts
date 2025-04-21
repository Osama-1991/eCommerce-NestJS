import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { ICart, IProduct, IProductCart, IUser } from 'src/DB/z_index';
import { oneUserResponse } from 'src/graphQl/dashboard/entities/dashboard.entity';
import { oneProductResponse } from 'src/graphQl/product/entities/product.entity';

@ObjectType()
export class ICartProductResponse implements IProductCart {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => Number)
  finalPrice: number;

  @Field(() => oneProductResponse)
  productId: IProduct;

  @Field(() => Number)
  quantity: number;
}

@ObjectType()
export class oneCartResponse implements ICart {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => [ICartProductResponse])
  products: IProductCart[];

  @Field(() => Number)
  subTotal: number;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => oneUserResponse)
  userId: IUser;
}

@InputType()
export class createCartDto {
  @Field(() => ID)
  productId: Types.ObjectId;
  @Field(() => String)
  quantity: number;
}
