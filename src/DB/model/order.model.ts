import {
  MongooseModule,
  Prop,
  raw,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product, User, Coupon } from './z_index';
import {
  IOrder,
  IOrderProduct,
  OrderStatus,
  PaymentWayType,
} from 'src/DB/interfaces/order.interface';

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class Order implements IOrder {
  @Prop(
    raw([
      {
        name: { type: String, required: true },
        productId: { type: Types.ObjectId, ref: Product.name },
        quantity: { type: Number, default: 1 },
        unitPrice: { type: Number, require: true },
        image: { type: String },
        finalPrice: {
          type: Number,
        },
        vendorId: { type: Types.ObjectId, ref: User.name },
      },
    ]),
  )
  products: IOrderProduct[];

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String })
  note?: string;

  @Prop({ type: String })
  intentId?: string;

  @Prop({ type: String })
  rejectedReason?: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
  })
  updatedBy?: Types.ObjectId;

  @Prop({ type: Date })
  paidAt?: Date;

  @Prop({
    type: Types.ObjectId,
    ref: Coupon.name,
  })
  couponId?: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  totalFinalPrice: number;

  @Prop({ type: Number, default: 0 })
  totalPriceBeforeDiscount: number;

  @Prop({ type: Number, default: 0, min: 0, max: 100 })
  discount: number;

  @Prop({ type: Number, default: 0, min: 0 })
  refundAmount?: number;

  @Prop({ type: Date })
  refundDate?: Date;

  @Prop({ type: String, enum: PaymentWayType, required: true })
  paymentWay: PaymentWayType;

  @Prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.pending,
    required: true,
  })
  status: OrderStatus;
  @Prop({ type: Date })
  expiresAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

export const OrderModel = MongooseModule.forFeature([
  { name: Order.name, schema: OrderSchema },
]);

export type OrderDoc = HydratedDocument<Order>;
