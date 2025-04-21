import { Field, InputType } from '@nestjs/graphql';

import { IQuery } from 'src/DB/z_index';

@InputType()
export class queryGraphQlPaginationDto implements IQuery {
  @Field(() => String, { nullable: true })
  page?: number;
  @Field(() => String, { nullable: true })
  limit?: number;
  @Field(() => String, { nullable: true })
  sort?: string;
}
