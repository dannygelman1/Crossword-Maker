import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateBoxInput {
  @Field({ description: 'ID of the game.' })
  game_id!: string;

  @Field({ description: 'X position of the box.' })
  x!: number;

  @Field({ description: 'Y position of the box.' })
  y!: number;

  @Field({ description: 'Whether or not the box is a block.' })
  isblock!: boolean;
}
