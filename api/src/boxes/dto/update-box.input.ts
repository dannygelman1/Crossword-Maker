import { CreateBoxInput } from './create-box.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateBoxInput extends PartialType(CreateBoxInput) {
  @Field(() => ID, { description: 'ID of the box.' })
  id!: string;

  @Field({ description: 'Letter in the box.', nullable: true })
  letter?: string;
}
