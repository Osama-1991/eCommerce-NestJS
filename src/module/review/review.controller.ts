import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create.dto';
import { Auth, queryPaginationDto, User } from 'src/common/z_index';
import { GetReviewIdDto, UpdateReviewDto } from './dto/update.dto';
import { productId } from '../product/dto/get.dto';
import { IUser, RoleTypes } from '../../DB/z_index';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  @Auth([RoleTypes.user])
  @Post('create-review/:productId')
  async create(
    @User() user: IUser,
    @Body() body: CreateReviewDto,
    @Param() params: Partial<productId>,
  ) {
    return await this.reviewService.create(user, body, params);
  }

  @Get('get-all-reviews/:productId')
  async findAll(
    @Param() params: Partial<productId>,
    @Query() query: queryPaginationDto,
  ) {
    return await this.reviewService.findAll(params, query);
  }

  @Auth([RoleTypes.user])
  @Get('get-review/:reviewId')
  findOne(@User() user: IUser, @Param() params: GetReviewIdDto) {
    return this.reviewService.findOne(user, params);
  }
  @Auth([RoleTypes.user, RoleTypes.superAdmin])
  @Patch('update-review/:reviewId')
  async update(
    @User() user: IUser,
    @Body() body: UpdateReviewDto,
    @Param() params: GetReviewIdDto,
  ) {
    return await this.reviewService.update(user, body, params);
  }
  @Auth([RoleTypes.user, RoleTypes.superAdmin])
  @Delete('delete-review/:reviewId')
  async remove(@User() user: IUser, @Param() params: GetReviewIdDto) {
    return await this.reviewService.remove(user, params);
  }
}
