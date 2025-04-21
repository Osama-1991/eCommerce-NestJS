import { Types } from 'mongoose';

export interface IMessage {
  message: string;
  createdAt?: Date;
  senderId: Types.ObjectId;
  seen?: boolean;
  read?: boolean;
}

export interface IChat {
  _id?: Types.ObjectId;
  mainUser: Types.ObjectId;
  otherUser: Types.ObjectId;
  messages: IMessage[];
  createdAt?: Date;
  updatedAt?: Date;
}
