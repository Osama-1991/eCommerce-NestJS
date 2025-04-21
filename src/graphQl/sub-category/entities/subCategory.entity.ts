import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import {
  IAttachmentType,
  ICategory,
  IPagination,
  ISubCategory,
  // IUser,
  oneAttachmentTypeResponse,
} from 'src/DB/z_index';
import {
  CategoryFilterDto,
  oneCategoryResponse,
} from 'src/graphQl/category/entities/category.entity';
// import { oneUserResponse } from 'src/module/user/entities/user.entity';

@ObjectType()
export class oneSubCategoryResponse implements Partial<ISubCategory> {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => oneCategoryResponse)
  categoryId: ICategory;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  // @Field(() => oneUserResponse)
  // createdBy: IUser;

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

  // @Field(() => oneUserResponse, { nullable: true })
  // updatedBy?: IUser;
}

@ObjectType()
export class PaginationSubCategoryResponse
  implements IPagination<ISubCategory>
{
  @Field(() => Number)
  page: number;
  @Field(() => Number)
  totalCount: number;
  @Field(() => Number)
  totalPages: number;
  @Field(() => [oneCategoryResponse])
  data: ISubCategory[];
}

@InputType()
export class filterSubCategoryDto extends CategoryFilterDto {
  @Field(() => ID)
  categoryId: Types.ObjectId;
}
