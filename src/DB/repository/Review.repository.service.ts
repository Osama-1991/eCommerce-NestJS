import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DBRepository } from './mainRepository/DB.Repository';
import { Review, ReviewDoc } from '../model/z_index';

@Injectable()
export class ReviewRepositoryService extends DBRepository<ReviewDoc> {
  constructor(
    @InjectModel(Review.name)
    private reviewModel: Model<ReviewDoc>,
  ) {
    super(reviewModel);
  }
}
