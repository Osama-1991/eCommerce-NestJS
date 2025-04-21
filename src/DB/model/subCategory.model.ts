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
import { NextFunction } from 'express';
import { IAttachmentType } from '../interfaces/z_index';
import { Category, User } from './z_index';
import { ISubCategory } from 'src/DB/interfaces/subCategory.interface';

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class SubCategory implements ISubCategory {
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

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);

export const SubCategoryModel = MongooseModule.forFeatureAsync([
  {
    name: SubCategory.name,
    useFactory() {
      SubCategorySchema.pre('save', function (next: NextFunction) {
        if (this.isModified('name')) {
          this.slug = slugify(this.name, { lower: true, trim: true });
        }
        return next();
      });
      return SubCategorySchema;
    },
  },
]);

export type SubCategoryDoc = HydratedDocument<SubCategory>;
