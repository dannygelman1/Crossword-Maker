import { CreateUserBoxInput } from './create-user_box.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateUserBoxInput extends PartialType(CreateUserBoxInput) {
  @Field(() => ID, { description: 'ID of the user box.' })
  id!: string;

  @Field({ description: 'Input letter.', nullable: true })
  letter?: string | null;
}
