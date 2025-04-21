import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { queryGraphQlPaginationDto } from 'src/common/utils/graphQl.query.dto';
import {
  IAttachmentType,
  ICategory,
  IPagination,
  IUser,
  oneAttachmentTypeResponse,
} from 'src/DB/z_index';
import { oneUserResponse } from 'src/graphQl/dashboard/entities/dashboard.entity';

@ObjectType()
export class oneCategoryResponse implements ICategory {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => oneUserResponse)
  createdBy: IUser;

  @Field(() => String)
  folderId: string;

  @Field(() => oneAttachmentTypeResponse)
  logo: IAttachmentType;

  @Field(() => String)
  name: string;

  @Field(() => String)
  slug: string;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  // @Field(() => oneUserResponse)
  // updatedBy?: IUser;
}

@ObjectType()
export class PaginationCategoryResponse implements IPagination<ICategory> {
  @Field(() => Number)
  page: number;
  @Field(() => Number)
  totalCount: number;
  @Field(() => Number)
  totalPages: number;
  @Field(() => [oneCategoryResponse])
  data: ICategory[];
}

@InputType()
export class CategoryFilterDto extends queryGraphQlPaginationDto {
  @Field(() => String, { nullable: true })
  name?: string;
}
