import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product, User } from './z_index';
import { IReview } from 'src/DB/interfaces/review.interface';

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class Review implements IReview {
  @Prop({
    type: String,
    required: true,
    minlength: 10,
    maxlength: 2000,
    trim: true,
  })
  text: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  createdBy: Types.ObjectId;
  @Prop({
    type: Types.ObjectId,
    ref: Product.name,
    required: true,
  })
  productId: Types.ObjectId;
  @Prop({
    type: Number,
    required: true,
    min: 0,
    max: 5,
  })
  rating: number;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

export const ReviewModel = MongooseModule.forFeature([
  { name: Review.name, schema: ReviewSchema },
]);

export type ReviewDoc = HydratedDocument<Review>;
