import { Types } from 'mongoose';
import { IProductCart } from 'src/DB/interfaces/cart.interface';
import { IUser } from 'src/DB/interfaces/user.interface';
import Stripe from 'stripe';
import { ICoupon } from './coupon.interface';

export enum OrderStatus {
  pending = 'pending',
  processing = 'processing',
  placed = 'placed',
  delivered = 'delivered',
  canceled = 'canceled',
  refunded = 'refunded',
}

export enum PaymentWayType {
  cash = 'cash',
  card = 'card',
  creditCard = 'creditCard',
  payPal = 'payPal',
  kNet = 'kNet',
  applePay = 'applePay',
  googlePay = 'googlePay',
  stcPay = 'stcPay',
  mada = 'mada',
  visa = 'visa',
  masterCard = 'masterCard',
}

export interface IOrderInput {
  address: string;
  phone: string;
  note?: string;
  paymentWay: PaymentWayType;
  couponId?: Types.ObjectId | ICoupon;
}

export interface IOrder extends IOrderInput {
  _id?: Types.ObjectId;
  products: IOrderProduct[];
  createdBy: Types.ObjectId | IUser;
  updatedBy?: Types.ObjectId | IUser;
  couponId?: Types.ObjectId;
  paidAt?: Date;
  intentId?: string;
  rejectedReason?: string;
  discount?: number;
  refundAmount?: number;
  refundDate?: Date;
  totalFinalPrice?: number;
  totalPriceBeforeDiscount?: number;
  status: OrderStatus;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrderProduct extends IProductCart {
  unitPrice: number;
  image: string;
  name: string;
  vendorId: Types.ObjectId | IUser;
}

interface data {
  url: any;
  client_secret: Partial<Stripe.Response<Stripe.PaymentIntent>> | null;
}

export interface IStripeCheckOut {
  message: string;
  data: data;
}

/* Stripe.Response<Stripe.Checkout.Session> */
