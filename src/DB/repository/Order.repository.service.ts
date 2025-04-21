import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DBRepository } from './mainRepository/DB.Repository';
import { Order, OrderDoc } from 'src/DB/z_index';

@Injectable()
export class OrderRepositoryService extends DBRepository<OrderDoc> {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<OrderDoc>,
  ) {
    super(orderModel);
  }
}
