import { Types } from 'mongoose';
import { IUser } from './user.interface';
import { IOrder, IProduct } from '../z_index';

export interface IVendorOrders {
  productId: Types.ObjectId | IProduct;
  orderId: Types.ObjectId | IOrder;
  quantity: number;
  finalPrice?: number;
}

export interface IVendorSales {
  userId: Types.ObjectId | IUser;
  orders?: IVendorOrders[];
  totalSales?: number;
}
