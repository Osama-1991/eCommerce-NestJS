import { Module } from '@nestjs/common';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from 'src/module/category/category.service';

@Module({
  providers: [CategoryResolver, CategoryService],
})
export class CategoryModule {}
