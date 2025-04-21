import {
  MongooseModule,
  Prop,
  raw,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './z_index';
import { IChat, IMessage } from '../interfaces/chat.interface';

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class Chat implements IChat {
  @Prop(
    raw({
      message: { type: String, require: true },
      createdAt: { type: Date },
      senderId: { type: Types.ObjectId, require: true },
      seen: { type: Boolean, default: false },
      read: { type: Boolean, default: false },
    }),
  )
  messages: IMessage[];

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  mainUser: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  otherUser: Types.ObjectId;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

export type ChatDoc = HydratedDocument<Chat>;

export const ChatModel = MongooseModule.forFeature([
  { name: Chat.name, schema: ChatSchema },
]);
