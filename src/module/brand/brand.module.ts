import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { BrandRepositoryService, BrandModel } from 'src/DB/z_index';

@Module({
  imports: [BrandModel],
  controllers: [BrandController],
  providers: [BrandService, BrandRepositoryService, BrandRepositoryService],
})
export class BrandModule {}
