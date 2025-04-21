import { Resolver } from '@nestjs/graphql';
import { ReviewService } from 'src/module/review/review.service';

@Resolver()
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}
}
