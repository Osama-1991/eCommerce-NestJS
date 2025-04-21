import { Types } from 'mongoose';
import { ICategory } from 'src/DB/z_index';

export interface IBrand extends ICategory {
  categoryId: Types.ObjectId;
}
