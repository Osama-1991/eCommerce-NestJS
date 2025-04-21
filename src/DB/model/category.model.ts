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
import { SubCategory, User } from './z_index';
import { IAttachmentType } from '../interfaces/z_index';
import { ICategory } from 'src/DB/interfaces/category.interface';

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class Category implements ICategory {
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
    default: function (this: Category) {
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
}

export const CategorySchema = SchemaFactory.createForClass(Category);

export const CategoryModel = MongooseModule.forFeatureAsync([
  {
    name: Category.name,
    useFactory() {
      CategorySchema.pre('save', function (next: NextFunction) {
        if (this.isModified('name')) {
          this.slug = slugify(this.name, { lower: true, trim: true });
        }
        return next();
      });
      CategorySchema.pre('findOneAndUpdate', function (next: NextFunction) {
        const update = this.getUpdate() || {};
        if (update['name']) {
          update['slug'] = slugify(update['name'], {
            lower: true,
            trim: true,
          });

          this.setUpdate(update);
        }
        return next();
      });
      CategorySchema.virtual('subCategories', {
        ref: SubCategory.name,
        localField: 'categoryId',
        foreignField: '_id',
      });

      return CategorySchema;
    },
  },
]);

export type CategoryDoc = HydratedDocument<Category>;
