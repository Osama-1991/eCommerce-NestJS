/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  MongooseModule,
  Prop,
  raw,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { NextFunction } from 'express';
import { Category, SubCategory, User } from './z_index';
import { IAttachmentType } from '../interfaces/z_index';
import { Brand } from './brand.model';
import { Color, IProduct, Size } from 'src/DB/interfaces/product.interface';

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class Product implements IProduct {
  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1000,
    trim: true,
  })
  name: string;
  @Prop({
    type: String,
    minlength: 2,
    trim: true,
    default: function (this: Product) {
      return slugify(this.name, { lower: true, trim: true });
    },
  })
  slug: string;
  @Prop({
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  })
  description: string;
  @Prop({
    type: Number,
    min: 0,
    required: true,
  })
  stock: number;
  @Prop({
    type: Number,
    min: 0,
    required: true,
  })
  originalPrice: number;

  @Prop({
    type: Number,
    min: 0,
    max: 100,
  })
  discountPercent: number;

  @Prop({
    type: Number,
    min: 0,
    max: 5,
    required: true,
  })
  rate: number;

  @Prop({
    type: Number,
    min: 0,
    default: function (this: Product) {
      return (this.finalPrice = Math.floor(
        this.originalPrice -
          (this.originalPrice * this.discountPercent || 0) / 100,
      ));
    },
  })
  finalPrice: number;

  @Prop([
    {
      type: String,
      enum: Size,
      default: Size.small,
    },
  ])
  size: Size[];

  @Prop([
    {
      type: String,
      enum: Color,
    },
  ])
  color: Color[];

  @Prop(
    raw({
      public_id: { type: String, require: true },
      secure_url: { type: String, require: true },
    }),
  )
  mainImage: IAttachmentType;

  @Prop(
    raw([
      {
        public_id: { type: String },
        secure_url: { type: String },
      },
    ]),
  )
  images: IAttachmentType[];

  @Prop({ required: true, type: String })
  folderId: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  vendorId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
  })
  updatedBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Category.name,
    required: true,
  })
  categoryId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: SubCategory.name,
    required: true,
  })
  subCategoryId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Brand.name,
    required: true,
  })
  brandId: Types.ObjectId;
  @Prop(raw({ userId: { type: Types.ObjectId, ref: User.name } }))
  userBuyerIds: { userId: Types.ObjectId }[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

export const ProductModel = MongooseModule.forFeatureAsync([
  {
    name: Product.name,
    useFactory() {
      ProductSchema.pre('save', function (next: NextFunction) {
        if (this.isModified('name')) {
          this.slug = slugify(this.name, { lower: true, trim: true });
        }
        if (
          this.isModified('originalPrice') ||
          this.isModified('discountPercent')
        ) {
          this.finalPrice = Math.floor(
            this.originalPrice -
              (this.originalPrice * this.discountPercent || 0) / 100,
          );
        }
        return next();
      });
      ProductSchema.pre('findOneAndUpdate', function (next: NextFunction) {
        const update = this.getUpdate() || {};
        if (update['name']) {
          update['slug'] = slugify(update['name'], {
            lower: true,
            trim: true,
          });
          this.setUpdate(update);
        }

        if (update['discountPercent'] || update['originalPrice']) {
          update['finalPrice'] = Math.floor(
            update['originalPrice'] -
              (update['originalPrice'] * update['discountPercent'] || 0) / 100,
          );

          this.setUpdate(update);
        }
        return next();
      });

      return ProductSchema;
    },
  },
]);

export type ProductDoc = HydratedDocument<Product>;
