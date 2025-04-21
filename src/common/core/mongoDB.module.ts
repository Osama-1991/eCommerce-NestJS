import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { resolve } from 'path';

const configPath: string = './config/.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve(configPath),
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URL as string), // connect to Mongoose
  ],
})
export class MongoDBModule {}
