import { Types } from 'mongoose';
import { IProduct, IUser } from 'src/DB/z_index';

export interface IProductQuantity {
  quantity: number;
}

export interface IProductCart extends IProductQuantity {
  _id?: Types.ObjectId;
  productId: Types.ObjectId | IProduct;
  finalPrice: number;
}

export interface ICart {
  _id?: Types.ObjectId;
  userId: Types.ObjectId | IUser;
  products: IProductCart[];
  subTotal?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
