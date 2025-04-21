import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './z_index';
import { ICoupon } from 'src/DB/interfaces/coupon.interface';
@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class Coupon implements ICoupon {
  @Prop({
    type: Number,
    required: true,
    min: 0,
    max: 100,
  })
  amount: number;
  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
  })
  code: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  createdBy: Types.ObjectId;
  @Prop({ type: Date, required: true })
  fromDate: Date;
  @Prop({ type: Date, required: true })
  toDate: Date;
  @Prop({
    type: [Types.ObjectId],
    ref: User.name,
  })
  usedBy: Types.ObjectId[];
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);

export const CouponModel = MongooseModule.forFeature([
  { name: Coupon.name, schema: CouponSchema },
]);

export type CouponDoc = HydratedDocument<Coupon>;
