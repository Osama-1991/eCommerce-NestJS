import { Types } from 'mongoose';
import { IUser } from './user.interface';

export interface ICoupon {
  _id?: Types.ObjectId;
  amount: number;
  createdBy: Types.ObjectId | IUser;
  fromDate: Date;
  code: string;
  toDate: Date;
  usedBy?: Types.ObjectId[] | IUser[];
  createdAt?: Date;
  updatedAt?: Date;
}
