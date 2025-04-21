import { Types } from 'mongoose';

export enum OtpTypes {
  verifyEmail = 'verifyEmail',
  forgotPassword = 'forgotPassword',
  verifyPhone = 'verifyPhone',
  resetPassword = 'resetPassword',
  changeEmail = 'changeEmail',
  changePhone = 'changePhone',
  changePassword = 'changePassword',
}

export interface IOtp {
  code: string;
  userId: Types.ObjectId;
  otpType: OtpTypes;
  expiryAt: Date;
}
