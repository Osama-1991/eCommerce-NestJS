import { Module } from '@nestjs/common';
import { ReviewResolver } from './review.resolver';
import { ReviewService } from 'src/module/review/review.service';
import { ReviewModel, ReviewRepositoryService } from 'src/DB/z_index';

@Module({
  imports: [ReviewModel],
  providers: [ReviewResolver, ReviewService, ReviewRepositoryService],
})
export class ReviewModule {}
