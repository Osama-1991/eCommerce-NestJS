import {
  MongooseModule,
  Prop,
  raw,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product, User } from './z_index';
import { NextFunction } from 'express';
import { ICart, IProductCart } from 'src/DB/interfaces/cart.interface';

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class Cart implements ICart {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  userId: Types.ObjectId;

  @Prop(
    raw([
      {
        productId: { type: Types.ObjectId, ref: Product.name },
        quantity: { type: Number, default: 1 },
        finalPrice: {
          type: Number,
        },
      },
    ]),
  )
  products: IProductCart[];

  @Prop({ type: Number, default: 0 })
  subTotal: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

export const CartModel = MongooseModule.forFeatureAsync([
  {
    name: Cart.name,
    useFactory() {
      CartSchema.pre<CartDoc>('save', function (next: NextFunction) {
        this.subTotal = this.products.reduce(
          (total, product) => total + product.finalPrice * product.quantity,
          0,
        );
        return next();
      });
      return CartSchema;
    },
  },
]);

export type CartDoc = HydratedDocument<Cart>;
