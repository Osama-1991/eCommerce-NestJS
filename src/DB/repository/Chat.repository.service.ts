import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DBRepository } from './mainRepository/DB.Repository';
import { Chat, ChatDoc } from '../model/chat.model';

@Injectable()
export class ChatRepositoryService extends DBRepository<ChatDoc> {
  constructor(
    @InjectModel(Chat.name)
    private chatModel: Model<ChatDoc>,
  ) {
    super(chatModel);
  }
}
