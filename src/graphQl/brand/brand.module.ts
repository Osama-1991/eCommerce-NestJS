import { Module } from '@nestjs/common';
import { BrandResolver } from './brand.resolver';
import { BrandService } from 'src/module/brand/brand.service';

@Module({
  providers: [BrandResolver, BrandService],
})
export class BrandModule {}
