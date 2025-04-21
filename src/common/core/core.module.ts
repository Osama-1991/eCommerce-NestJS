import { Module } from '@nestjs/common';
import { EmailModule } from './email.module';
import { MongoDBModule } from './mongoDB.module';
import { cacheModule } from './cache.module';

@Module({
  imports: [cacheModule, EmailModule, MongoDBModule],
  exports: [cacheModule, EmailModule, MongoDBModule],
})
export class coreModule {}
