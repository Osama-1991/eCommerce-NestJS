import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Types } from 'mongoose';
import {
  IProduct,
  IUser,
  IOrder,
  IOrderProduct,
  OrderStatus,
  PaymentWayType,
  IOrderInput,
} from 'src/DB/z_index';
import { oneUserResponse } from '../../dashboard/entities/dashboard.entity';
import { oneProductResponse } from 'src/graphQl/product/entities/product.entity';

registerEnumType(PaymentWayType, {
  name: 'PaymentWayType',
});

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});

@ObjectType()
export class IOrderProductResponse implements Partial<IOrderProduct> {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => Number)
  finalPrice: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  image: string;

  @Field(() => Number)
  quantity: number;

  @Field(() => Number)
  unitPrice: number;

  @Field(() => oneProductResponse)
  productId: IProduct;
  // @Field(() => oneUserResponse)
  // vendorId: IUser;
}

@ObjectType()
export class oneOrderResponse implements IOrder {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => String)
  address: string;

  @Field(() => String, { nullable: true })
  note?: string;

  @Field(() => [IOrderProductResponse]) //------------
  products: IOrderProduct[];

  @Field(() => oneUserResponse)
  createdBy: IUser;

  @Field(() => ID, { nullable: true })
  updatedBy?: Types.ObjectId;

  @Field(() => ID, { nullable: true })
  couponId?: Types.ObjectId;

  @Field(() => Date, { nullable: true })
  paidAt?: Date;

  @Field(() => String, { nullable: true })
  intentId?: string;

  @Field(() => String, { nullable: true })
  rejectedReason?: string;

  @Field(() => Number, { nullable: true })
  discount?: number;

  @Field(() => Number, { nullable: true })
  refundAmount?: number;

  @Field(() => Date, { nullable: true })
  refundDate?: Date;

  @Field(() => Number, { nullable: true })
  totalFinalPrice?: number;

  @Field(() => Number, { nullable: true })
  totalPriceBeforeDiscount?: number;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => Date)
  expiresAt: Date;

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt?: Date;

  @Field(() => String)
  phone: string;

  @Field(() => PaymentWayType)
  paymentWay: PaymentWayType;
}

@InputType()
export class createOrderDto implements IOrderInput {
  @Field(() => String)
  address: string;

  @Field(() => String, { nullable: true })
  note?: string;

  @Field(() => PaymentWayType)
  paymentWay: PaymentWayType;

  @Field(() => String)
  phone: string;

  @Field(() => ID, { nullable: true })
  couponId?: Types.ObjectId;
}
