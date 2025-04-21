import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ReviewModel, ReviewRepositoryService } from 'src/DB/z_index';

@Module({
  imports: [ReviewModel],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepositoryService],
})
export class ReviewModule {}
