import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import {
  IAttachmentType,
  IBrand,
  oneAttachmentTypeResponse,
} from 'src/DB/z_index';

@ObjectType()
export class oneBrandResponse implements Partial<IBrand> {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => String)
  folderId: string;

  @Field(() => oneAttachmentTypeResponse)
  logo: IAttachmentType;

  @Field(() => String)
  name: string;

  @Field(() => String)
  slug: string;

  @Field(() => Date)
  updatedAt?: Date;

  @Field(() => Date)
  createdAt?: Date;
}
