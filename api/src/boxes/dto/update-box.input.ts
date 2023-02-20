import { CreateBoxInput } from './create-box.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBoxInput extends PartialType(CreateBoxInput) {
  @Field({ description: 'Letter in the box.', nullable: true })
  letter?: number;
}
