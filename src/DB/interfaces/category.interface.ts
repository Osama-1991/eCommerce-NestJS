import { Types } from 'mongoose';
import { IAttachmentType } from 'src/DB/interfaces/images.interface';
import { IUser } from './user.interface';

export interface ICategoryInput {
  name: string;
}

export interface ICategory extends ICategoryInput {
  _id?: Types.ObjectId;
  slug?: string;
  logo: IAttachmentType;
  folderId: string;
  createdBy: Types.ObjectId | IUser;
  updatedBy?: Types.ObjectId | IUser;
  createdAt?: Date;
  updatedAt?: Date;
}
