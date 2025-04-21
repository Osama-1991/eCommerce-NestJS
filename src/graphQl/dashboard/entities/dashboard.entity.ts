import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import {
  GenderTypes,
  IAttachmentType,
  IOrder,
  IProduct,
  IUser,
  IVendorOrders,
  IVendorSales,
  oneAttachmentTypeResponse,
  RoleTypes,
} from 'src/DB/z_index';
import { oneOrderResponse } from 'src/graphQl/order/entities/order.entity';
import { oneProductResponse } from 'src/graphQl/product/entities/product.entity';

registerEnumType(GenderTypes, {
  name: 'GenderTypes',
});

registerEnumType(RoleTypes, {
  name: 'RoleTypes',
});

@ObjectType()
export class oneUserResponse implements Partial<IUser> {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => Date)
  DOB: Date;

  @Field(() => String)
  address: string;

  @Field(() => String)
  email: string;

  @Field(() => GenderTypes)
  gender: GenderTypes;

  @Field(() => String)
  fName: string;

  @Field(() => String)
  lName: string;

  @Field(() => String)
  phone: string;

  @Field(() => RoleTypes)
  role: RoleTypes;

  @Field(() => String)
  password: string;

  @Field(() => oneAttachmentTypeResponse, { nullable: true })
  profile_img?: IAttachmentType;
}

@ObjectType()
export class IOrdersVendorResponse implements IVendorOrders {
  @Field(() => Number)
  finalPrice: number;
  @Field(() => oneOrderResponse)
  orderId: IOrder;
  @Field(() => oneProductResponse)
  productId: IProduct;
  @Field(() => Number)
  quantity: number;
}

@ObjectType()
export class oneVendorSales implements IVendorSales {
  @Field(() => ID)
  _id: Types.ObjectId;
  @Field(() => [IOrdersVendorResponse], { nullable: true })
  orders?: IVendorOrders[];
  @Field(() => Number)
  totalSales: number;
  @Field(() => oneUserResponse, { nullable: true })
  userId: IUser;
}
