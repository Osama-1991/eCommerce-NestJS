import { Types } from 'mongoose';
import { IAttachmentType } from 'src/DB/z_index';

export enum GenderTypes {
  male = 'male',
  female = 'female',
}

export enum RoleTypes {
  superAdmin = 'superAdmin',
  admin = 'admin',
  vendor = 'vendor',
  user = 'user',
  guest = 'guest',
}

export interface IUser {
  _id?: Types.ObjectId;
  fName: string;
  lName: string;
  email: string;
  password: string;
  phone: string;
  DOB?: Date;
  gender: GenderTypes;
  numberOfOtpSend?: number;
  role?: RoleTypes;
  isDeleted?: boolean;
  confirmEmailAt?: Date;
  isConfirmed?: boolean;
  changeCredentialTime?: Date;
  profile_img?: IAttachmentType;
  address: string;
}
