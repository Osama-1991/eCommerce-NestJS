import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { OrderRepositoryService } from './../../DB/repository/Order.repository.service';
import { Request } from 'express';
import { OrderStatus } from 'src/DB/interfaces/order.interface';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private readonly orderRepositoryService: OrderRepositoryService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }

  /********************************* CHECKOUT SESSION *********************************/

  async checkOutSession({
    customer_email,
    mode = 'payment',
    cancel_url = process.env.CANCEL_URL,
    success_url = process.env.SUCCESS_URL,
    metadata = {},
    line_items = [],
    discounts = [],
  }: Stripe.Checkout.SessionCreateParams): Promise<
    Stripe.Response<Stripe.Checkout.Session>
  > {
    const session = await this.stripe.checkout.sessions.create({
      customer_email,
      mode,
      cancel_url,
      success_url,
      metadata,
      line_items,
      discounts,
    });
    return session;
  }

  /********************************* COUPON *********************************/

  async createCoupon(
    params: Stripe.CouponCreateParams,
  ): Promise<Stripe.Response<Stripe.Coupon>> {
    const coupon = await this.stripe.coupons.create(params);
    return coupon;
  }

  /********************************* WEBHOOK *********************************/

  async webhook(req: Request) {
    const body: string | Buffer = req.body as string | Buffer;

    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
    const signature = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        endpointSecret,
      );
    } catch (err) {
      throw new BadRequestException(
        `Webhook signature verification failed. ${err}`,
      );
    }

    if (event.type !== 'checkout.session.completed') {
      throw new BadRequestException('Invalid event type.');
    }

    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      throw new BadRequestException('Missing order ID in metadata.');
    }

    const order = await this.orderRepositoryService.findOne({
      filter: {
        _id: orderId,
        status: OrderStatus.pending,
        createdAt: { $lte: Date.now() + 24 * 60 * 60 * 1000 },
      },
    });

    if (!order) {
      throw new BadRequestException('Invalid or expired order.');
    }

    await this.confirmPaymentIntent(order.intentId as string);

    await this.orderRepositoryService.updateOne({
      filter: {
        _id: orderId,
        status: OrderStatus.pending,
        createdAt: { $lte: Date.now() + 24 * 60 * 60 * 1000 },
      },
      update: {
        status: OrderStatus.placed,
        paidAt: Date.now(),
      },
    });

    return 'Done';
  }

  /********************************* PAYMENT INTENT *********************************/

  async createPaymentIntent(
    amount: number,
    currency: string = 'egp',
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const paymentMethod = await this.createPaymentMethod();

    const intent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      payment_method: paymentMethod.id,
    });

    return intent;
  }

  async createPaymentMethod(
    token: string = 'tok_visa',
  ): Promise<Stripe.PaymentMethod> {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        token,
      },
    });
    return paymentMethod;
  }

  /***************************************************************************************************************/

  async retrievePaymentIntent(
    id: string,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const paymentIntent: Stripe.Response<Stripe.PaymentIntent> =
      await this.stripe.paymentIntents.retrieve(id);
    return paymentIntent;
  }

  /***************************************************************************************************************/

  async confirmPaymentIntent(
    id: string,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const intent: Stripe.Response<Stripe.PaymentIntent> =
      await this.retrievePaymentIntent(id);

    if (!intent) {
      throw new BadRequestException('Invalid payment intent.');
    }
    const paymentIntent = await this.stripe.paymentIntents.confirm(intent.id, {
      payment_method: 'pm_card_visa',
    });
    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException('Payment confirmation failed.');
    }
    return paymentIntent;
  }

  /********************************* REFUND *********************************/

  async refund(id: string): Promise<Stripe.Response<Stripe.Refund>> {
    const refund = await this.stripe.refunds.create({
      payment_intent: id,
    });
    return refund;
  }
}
