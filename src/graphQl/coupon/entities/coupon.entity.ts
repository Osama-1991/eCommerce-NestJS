import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { ICoupon, IUser } from 'src/DB/z_index';
import { oneUserResponse } from 'src/graphQl/dashboard/entities/dashboard.entity';

@ObjectType()
export class oneCouponResponse implements ICoupon {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => Number)
  amount: number;

  @Field(() => String)
  code: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => oneUserResponse)
  createdBy: IUser;

  @Field(() => Date)
  fromDate: Date;

  @Field(() => Date)
  toDate: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => [oneUserResponse], { nullable: true })
  usedBy?: IUser[];
}
