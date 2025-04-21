import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Types } from 'mongoose';
import {
  Color,
  IAttachmentType,
  IBrand,
  IPagination,
  IProduct,
  ISubCategory,
  IUser,
  oneAttachmentTypeResponse,
  Size,
} from 'src/DB/z_index';
import { oneUserResponse } from '../../dashboard/entities/dashboard.entity';
import { oneSubCategoryResponse } from 'src/graphQl/sub-category/entities/subCategory.entity';
import { oneBrandResponse } from 'src/graphQl/brand/entities/brand.entity';
import { queryGraphQlPaginationDto } from 'src/common/utils/graphQl.query.dto';

registerEnumType(Color, {
  name: 'Color',
});

registerEnumType(Size, {
  name: 'Size',
});

@ObjectType()
export class oneProductResponse implements Partial<IProduct> {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => String)
  name: string;

  @Field(() => oneBrandResponse, { nullable: true })
  brandId: IBrand;

  @Field(() => oneSubCategoryResponse)
  subCategoryId: ISubCategory;

  @Field(() => [Color], { nullable: true })
  color?: Color[];

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Number)
  finalPrice: number;

  @Field(() => String)
  slug: string;

  @Field(() => oneAttachmentTypeResponse)
  mainImage: IAttachmentType;

  @Field(() => [oneAttachmentTypeResponse], { nullable: true })
  images?: IAttachmentType[];

  @Field(() => Number)
  originalPrice: number;

  @Field(() => Number, { nullable: true })
  discountPercent: number;

  @Field(() => Number)
  rate: number;

  @Field(() => [Size], { nullable: true })
  size?: Size[];

  @Field(() => Number)
  stock: number;

  // @Field(() => [oneUserResponse])
  // userBuyerIds: { userId: Types.ObjectId }[];

  @Field(() => String)
  folderId: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  // @Field(() => oneUserResponse, { nullable: true })
  // updatedBy?: IUser;

  @Field(() => oneUserResponse, { nullable: true })
  vendorId?: IUser;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}

@ObjectType()
export class PaginationProductsResponse implements IPagination<IProduct> {
  @Field(() => Number)
  page: number;
  @Field(() => Number)
  totalCount: number;
  @Field(() => Number)
  totalPages: number;
  @Field(() => [oneProductResponse])
  data: IProduct[];
}

@InputType()
export class getGraphQlProductsQueryDto extends queryGraphQlPaginationDto {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  minPrice?: number;

  @Field(() => String, { nullable: true })
  maxPrice?: number;

  @Field(() => String, { nullable: true })
  minRate?: number;

  @Field(() => String, { nullable: true })
  maxRate?: number;

  @Field(() => String, { nullable: true })
  minDiscount?: number;

  @Field(() => String, { nullable: true })
  maxDiscount?: number;

  @Field(() => String, { nullable: true })
  minStockQuantity?: number;

  @Field(() => String, { nullable: true })
  maxStockQuantity?: number;
}

@InputType()
export class filterProductsDto extends getGraphQlProductsQueryDto {
  @Field(() => ID)
  subCategoryId: Types.ObjectId;
  @Field(() => ID)
  categoryId: Types.ObjectId;
}
