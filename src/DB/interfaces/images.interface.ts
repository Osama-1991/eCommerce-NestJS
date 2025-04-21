import { Field, ObjectType } from '@nestjs/graphql';

export interface IAttachmentType {
  public_id: string;
  secure_url: string;
}

@ObjectType()
export class oneAttachmentTypeResponse implements IAttachmentType {
  @Field(() => String)
  public_id: string;
  @Field(() => String)
  secure_url: string;
}
