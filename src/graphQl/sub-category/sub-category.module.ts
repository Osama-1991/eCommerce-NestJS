import { Module } from '@nestjs/common';
import { SubCategoryResolver } from './sub-category.resolver';
import { SubCategoryService } from 'src/module/sub-category/sub-category.service';

@Module({
  providers: [SubCategoryResolver, SubCategoryService],
})
export class SubCategoryModule {}
