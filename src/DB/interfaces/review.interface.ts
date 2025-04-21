import { Types } from 'mongoose';
import { IProduct } from './product.interface';
import { IUser } from './user.interface';

export interface IReview {
  _id?: Types.ObjectId;
  text: string;
  createdBy: Types.ObjectId | IUser;
  productId: Types.ObjectId | IProduct;
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
}
