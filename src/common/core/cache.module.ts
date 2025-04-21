import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 10000, //   This is the maximum duration an item can remain in the cache before being removed.
    }),
  ],
})
export class cacheModule {}
