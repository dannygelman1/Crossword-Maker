import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserBoxInput {
  @Field({ description: 'ID of the box.' })
  box_id!: string;

  @Field({ description: 'Name of user.' })
  name!: string;

  @Field({ description: 'Input letter.' })
  letter!: string;
}
