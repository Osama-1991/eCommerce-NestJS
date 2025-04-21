import {
  MongooseModule,
  Prop,
  raw,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IUser, IVendorOrders, IVendorSales } from '../interfaces/z_index';
import { Order, Product, User } from '../model/z_index';

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class VendorSales implements IVendorSales {
  @Prop(
    raw([
      {
        productId: { type: Types.ObjectId, ref: Product.name },
        orderId: { type: Types.ObjectId, ref: Order.name },
        quantity: { type: Number, required: true },
        finalPrice: { type: Number, default: 0, required: false },
      },
    ]),
  )
  orders?: IVendorOrders[];

  @Prop({ type: Number, default: 0 })
  totalSales?: number;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  userId: Types.ObjectId | IUser;
}

export const VendorSalesSchema = SchemaFactory.createForClass(VendorSales);

export const vendorSalesModel = MongooseModule.forFeature([
  { name: VendorSales.name, schema: VendorSalesSchema },
]);

export type VendorSalesDoc = HydratedDocument<VendorSales>;
