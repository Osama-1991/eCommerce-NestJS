import { Types } from 'mongoose';
import { IAttachmentType, IBrand } from 'src/DB/z_index';
import {
  ICategory,
  ICategoryInput,
} from 'src/DB/interfaces/category.interface';
import { ISubCategory } from 'src/DB/interfaces/subCategory.interface';
import { IUser } from 'src/DB/interfaces/user.interface';

export enum Size {
  small = 'small',
  medium = 'medium',
  large = 'large',
  XLarge = 'XLarge',
  XXLarge = 'XXLarge',
  XXXLarge = 'XXXLarge',
}
export enum Color {
  red = 'red',
  blue = 'blue',
  green = 'green',
  yellow = 'yellow',
  purple = 'purple',
  orange = 'orange',
  pink = 'pink',
  white = 'white',
  black = 'black',
  gray = 'gray',
  brown = 'brown',
}

export interface IProductInput extends ICategoryInput {
  description: string;
  stock: number;
  rate: number;
  originalPrice: number;
  discountPercent?: number;
  size?: Size[];
  color?: Color[];
  categoryId: Types.ObjectId | ICategory;
  subCategoryId: Types.ObjectId | ISubCategory;
  brandId: Types.ObjectId | IBrand;
}

export interface IProduct extends IProductInput {
  _id?: Types.ObjectId;
  slug: string;
  finalPrice?: number;
  mainImage: IAttachmentType;
  images?: IAttachmentType[];
  userBuyerIds: { userId: Types.ObjectId | IUser }[];
  folderId: string;
  vendorId: Types.ObjectId | IUser;
  updatedBy?: Types.ObjectId | IUser;
  createdAt?: Date;
  updatedAt?: Date;
}
