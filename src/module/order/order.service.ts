import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateOrderDto } from './dto/create.dto';
import { OrderIdDto } from './dto/get.dto';
import { PaymentService } from './../../common/service/payment.service';
import { Request } from 'express';
import { Types } from 'mongoose';
import {
  CartRepositoryService,
  CouponRepositoryService,
  OrderDoc,
  OrderRepositoryService,
  ProductRepositoryService,
  IOrder,
  IOrderProduct,
  IStripeCheckOut,
  OrderStatus,
  PaymentWayType,
  IUser,
  ProductPopulate,
  VendorSalesRepositoryService,
  OrderPopulate,
} from 'src/DB/z_index';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepositoryService: OrderRepositoryService,
    private readonly cartRepositoryService: CartRepositoryService,
    private readonly productRepositoryService: ProductRepositoryService,
    private readonly couponRepositoryService: CouponRepositoryService,
    private readonly paymentService: PaymentService,
    private readonly vendorSalesRepositoryService: VendorSalesRepositoryService,
  ) {}

  async createOrder(user: IUser, Body: CreateOrderDto): Promise<IOrder> {
    const { couponId, paymentWay } = Body;
    const userId = user._id;

    if (!userId) {
      throw new NotFoundException('user not found');
    }

    const cart = await this.cartRepositoryService.findOne({
      filter: { userId },
    });

    if (!cart?.products?.length) {
      throw new BadRequestException('Empty Cart');
    }

    let totalPriceBeforeDiscount: number = 0;

    let totalFinalPrice: number = 0;

    const products: IOrderProduct[] = [];

    for (const product of cart.products) {
      const checkProduct = await this.productRepositoryService.findOne({
        filter: {
          _id: product.productId,
          stock: { $gte: product.quantity },
        },
      });

      if (!checkProduct) {
        throw new BadRequestException(
          'Not enough quantity of product ::   ' + product.quantity,
        );
      }
      products.push({
        name: checkProduct.name,
        productId: product.productId,
        unitPrice: checkProduct.finalPrice,
        quantity: product.quantity,
        finalPrice: checkProduct.finalPrice * product.quantity,
        image: checkProduct.mainImage.secure_url,
        vendorId: checkProduct.vendorId,
      });
      totalPriceBeforeDiscount += checkProduct.finalPrice * product.quantity;
    }

    totalFinalPrice = totalPriceBeforeDiscount;

    let discount: number = 0;

    if (couponId) {
      const coupon = await this.couponRepositoryService.findOne({
        filter: {
          _id: couponId,
          usedBy: { $nin: [userId] },
          // toData: { $gte: Date.now() },
        },
      });

      if (!coupon) {
        throw new NotFoundException(
          'coupon not found or expired or used by you',
        );
      }

      discount = coupon.amount;
      const discountAmount: number = Math.floor(
        (totalPriceBeforeDiscount * discount) / 100,
      );
      totalFinalPrice -= discountAmount;

      coupon.usedBy.push(userId);
      await coupon.save();
    }

    const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 hours

    const order = await this.orderRepositoryService.create({
      createdBy: userId,
      address: Body.address,
      phone: Body.phone,
      note: Body.note,
      discount,
      paymentWay,
      status:
        paymentWay == PaymentWayType.cash
          ? OrderStatus.placed
          : OrderStatus.pending,
      totalPriceBeforeDiscount,
      totalFinalPrice,
      products,
      couponId,
      expiresAt,
    });

    await this.cartRepositoryService.deleteOne({ filter: { userId } });

    const productStock: { productId: Types.ObjectId; stock: number }[] = [];

    for (const product of products) {
      const items = await this.productRepositoryService.findOneAndUpdate({
        filter: { _id: product.productId },
        update: {
          $inc: { stock: -product.quantity },
        },
      });

      if (!items) {
        throw new NotFoundException('product not found');
      }

      await this.vendorSalesRepositoryService.updateOne({
        filter: { userId: product.vendorId },
        update: {
          $addToSet: {
            orders: {
              productId: product.productId,
              orderId: order._id,
              quantity: product.quantity,
              finalPrice: product.finalPrice,
            },
          },
        },
      });

      productStock.push({ productId: items._id, stock: items.stock });

      /**********************************/

      await this.productRepositoryService.updateOne({
        filter: { _id: product.productId },
        update: {
          $addToSet: { userBuyerIds: { userId } },
        },
      });
    }

    const OrderGraphQl = await this.orderRepositoryService.findById({
      id: order._id,
      populate: Object.values(OrderPopulate),
    });
    if (!OrderGraphQl) {
      throw new NotFoundException('order not found');
    }

    return OrderGraphQl;
  }

  private async _checkOut(
    user: IUser,
    order: OrderDoc,
  ): Promise<IStripeCheckOut> {
    const orderId = order._id;

    const discounts: object[] = [];
    if (order.discount) {
      const coupon = await this.paymentService.createCoupon({
        percent_off: order.discount,
        duration: 'once',
      });
      discounts.push({ coupon: coupon.id });
    }
    const session = await this.paymentService.checkOutSession({
      customer_email: user.email,
      line_items: order.products.map((product) => {
        return {
          quantity: product.quantity,
          price_data: {
            currency: 'egp',
            product_data: {
              name: product.name,
              images: [product.image],
            },
            unit_amount: product.unitPrice * 100,
          },
        };
      }),
      metadata: {
        orderId: orderId.toString(),
      },
      cancel_url: `${process.env.CANCEL_URL}/order/${orderId.toString()}/cancel`,
      success_url: `${process.env.SUCCESS_URL}/order/${orderId.toString()}/success`,
      discounts,
    });
    const intent = await this.paymentService.createPaymentIntent(
      order.totalFinalPrice,
    );
    await this.orderRepositoryService.updateOne({
      filter: {
        _id: order._id,
      },
      update: {
        intentId: intent.id,
      },
    });

    return {
      message: 'done',
      data: {
        url: session.url,
        client_secret: intent.client_secret
          ? { client_secret: intent.client_secret }
          : null,
      },
    };
  }

  async webhook(req: Request) {
    return await this.paymentService.webhook(req);
  }

  async cancelOrder(
    orderId: Types.ObjectId,
    user: IUser,
  ): Promise<{ message: string }> {
    const order = await this.orderRepositoryService.findOne({
      filter: {
        _id: orderId,
        createdBy: user._id,
        $or: [{ status: OrderStatus.pending }, { status: OrderStatus.placed }],
        paymentWay: PaymentWayType.card,
        createdAt: { $lte: Date.now() + 24 * 60 * 60 * 1000 },
      },
    });

    if (!order) {
      throw new NotFoundException('invalid order not found');
    }

    let refund = {};

    if (
      order.paymentWay == PaymentWayType.card &&
      order.status == OrderStatus.placed
    ) {
      // refund
      refund = {
        refundAmount: order.totalFinalPrice,
        refundDate: Date.now(),
      };
      await this.paymentService.refund(order.intentId as string);
    }

    await this.orderRepositoryService.updateOne({
      filter: {
        _id: order._id,
      },
      update: {
        ...refund,
        status: OrderStatus.canceled,
        updatedBy: user._id,
      },
    });

    for (const product of order.products) {
      await this.productRepositoryService.updateOne({
        filter: { _id: product.productId },
        update: {
          $inc: { stock: product.quantity },
          $pull: { userBuyerIds: { userId: user._id } },
        },
      });
      await this.vendorSalesRepositoryService.updateOne({
        filter: { userId: product.vendorId },
        update: {
          $pull: {
            orders: {
              productId: product.productId,
              orderId: order._id,
              quantity: product.quantity,
              finalPrice: product.finalPrice,
            },
          },
        },
      });
    }

    return { message: 'order has been cancelled ' };
  }

  async checkOut(
    user: IUser,
    params: OrderIdDto,
  ): Promise<IStripeCheckOut | { message: string }> {
    const { orderId } = params;
    const order = await this.orderRepositoryService.findOne({
      filter: {
        _id: orderId,
        createdBy: user._id,
        status: OrderStatus.pending,
        paymentWay: PaymentWayType.card,
      },
    });
    if (!order) {
      throw new BadRequestException('Invalid Order or Expire Time');
    }

    if (order.expiresAt > new Date(Date.now())) {
      return await this._checkOut(user, order);
    } else {
      return await this.cancelOrder(orderId, user);
    }
  }

  async findAll(): Promise<IOrder[]> {
    const orders = await this.orderRepositoryService.find({
      populate: [
        {
          path: 'products',
          populate: {
            path: 'productId',
            populate: Object.values(ProductPopulate),
          },
        },
        {
          path: 'createdBy',
        },
      ],
    });

    return orders;
  }
}
