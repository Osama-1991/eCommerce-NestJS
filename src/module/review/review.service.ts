import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create.dto';
import { GetReviewIdDto, UpdateReviewDto } from './dto/update.dto';
import { productId } from '../product/dto/get.dto';
import {
  IPagination,
  ReviewRepositoryService,
  UserRepositoryService,
  ProductRepositoryService,
  IUser,
  IReview,
  RoleTypes,
} from 'src/DB/z_index';
import { queryPaginationDto } from 'src/common/z_index';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepositoryService: ReviewRepositoryService,
    private readonly userRepositoryService: UserRepositoryService,
    private readonly productRepositoryService: ProductRepositoryService,
  ) {}
  async create(
    user: IUser,
    body: CreateReviewDto,
    params: Partial<productId>,
  ): Promise<IReview> {
    const { productId } = params;
    const product = await this.productRepositoryService.findOne({
      filter: {
        _id: productId,
        userBuyerIds: {
          $in: [user._id],
        },
      },
    });
    if (!product) {
      throw new NotFoundException(
        'Product not found or you cannot add review before you buy the product',
      );
    }
    const review = await this.reviewRepositoryService.create({
      ...body,
      createdBy: user._id,
      productId,
    });
    return review;
  }

  async findAll(
    params: Partial<productId>,
    query: queryPaginationDto,
  ): Promise<IPagination<IReview>> {
    const { page, limit, sort, select } = query;

    const { productId } = params;
    const review = await this.reviewRepositoryService.pagination({
      filter: {
        productId,
      },
      page,
      limit,
      sort,
      select,
    });

    return review;
  }

  async findOne(user: IUser, params: GetReviewIdDto): Promise<IReview> {
    const { reviewId } = params;
    const review = await this.reviewRepositoryService.findOne({
      filter: {
        _id: reviewId,
        createdBy: user._id,
      },
    });
    if (!review) {
      throw new NotFoundException('review not found');
    }
    return review;
  }

  async update(
    user: IUser,
    body: UpdateReviewDto,
    params: GetReviewIdDto,
  ): Promise<IReview> {
    const { reviewId } = params;
    if (!body) {
      throw new NotFoundException('No data provided');
    }
    let review = await this.reviewRepositoryService.findById({
      id: reviewId,
    });

    if (!review) {
      throw new NotFoundException('Review not found or not created by user');
    }

    if (user.role !== RoleTypes.superAdmin && review.createdBy !== user._id) {
      throw new BadRequestException('you cannot update review ');
    }

    review = await this.reviewRepositoryService.findByIdAndUpdate({
      id: reviewId,
      update: {
        ...body,
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found or not created by user');
    }

    return review;
  }

  async remove(
    user: IUser,
    params: GetReviewIdDto,
  ): Promise<{ message: string }> {
    const { reviewId } = params;
    const review = await this.reviewRepositoryService.findById({
      id: reviewId,
    });
    if (!review) {
      throw new NotFoundException('review not found');
    }

    if (user.role !== RoleTypes.superAdmin && review.createdBy !== user._id) {
      throw new BadRequestException('you cannot delete review ');
    }

    await this.reviewRepositoryService.deleteOne({ filter: { _id: reviewId } });

    return { message: 'review has been deleted' };
  }
}
