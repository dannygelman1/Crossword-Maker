import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateBoxInput {
  @Field({ description: 'X position of the box.' })
  x!: number;

  @Field({ description: 'Y position of the box.' })
  y!: number;

  @Field({ description: 'Whether or not the box is a block.' })
  isblock!: boolean;
}
