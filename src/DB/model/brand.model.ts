/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import { Category, User } from './z_index';
import { NextFunction } from 'express';
import { IBrand, IAttachmentType } from 'src/DB/z_index';

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class Brand implements IBrand {
  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    unique: true,
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    minlength: 2,
    trim: true,
    default: function () {
      return slugify(this.name, { lower: true, trim: true });
    },
  })
  slug: string;

  @Prop({ required: true, type: String })
  folderId: string;

  @Prop(
    raw({
      public_id: { type: String, require: true },
      secure_url: { type: String, require: true },
    }),
  )
  logo: IAttachmentType;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  createdBy: Types.ObjectId;

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
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

export const BrandModel = MongooseModule.forFeatureAsync([
  {
    name: Brand.name,
    useFactory() {
      BrandSchema.pre('save', function (next: NextFunction) {
        if (this.isModified('name')) {
          this.slug = slugify(this.name, { lower: true, trim: true });
        }
        return next();
      });

      BrandSchema.pre('findOneAndUpdate', function (next: NextFunction) {
        const update = this.getUpdate() || {};
        if (update['name']) {
          update['slug'] = slugify(update['name'], { lower: true, trim: true });
          this.setUpdate(update);
        }
        return next();
      });
      return BrandSchema;
    },
  },
]);

export type BrandyDoc = HydratedDocument<Brand>;
