import { Types } from 'mongoose';
import { ICategory } from 'src/DB/interfaces/category.interface';

export interface ISubCategoryInput {
  name: string;
  category: Types.ObjectId;
}

export interface ISubCategory extends ICategory {
  categoryId: Types.ObjectId | ICategory;
}
