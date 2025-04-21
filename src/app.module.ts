import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestApiModule } from './module/z_index';
import {
  GlobalAuthProviderModule,
  GlobalProviderModule,
  coreModule,
} from './common/z_index';
import { GraphQlModule } from './graphQl/graphQl.module';

@Module({
  imports: [
    coreModule,
    GlobalAuthProviderModule,
    GlobalProviderModule,
    RestApiModule,
    GraphQlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
