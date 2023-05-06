import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UserBoxesService } from './user_boxes.service';
import { UserBox } from './entities/user_box.entity';
import { CreateUserBoxInput } from './dto/create-user_box.input';
import { UpdateUserBoxInput } from './dto/update-user_box.input';

@Resolver(() => UserBox)
export class UserBoxesResolver {
  constructor(private readonly userBoxesService: UserBoxesService) {}

  @Mutation(() => UserBox)
  createUserBox(
    @Args('createUserBoxInput') createUserBoxInput: CreateUserBoxInput,
  ): Promise<UserBox> {
    console.log('createUserBoxInput', createUserBoxInput);
    return this.userBoxesService.create(createUserBoxInput);
  }

  // @Query(() => [UserBox], { name: 'userBoxes' })
  // findAll(
  //   @Args('name', { type: () => String }) name: string,
  //   @Args('game_id', { type: () => String }) game_id: string,
  // ): Promise<UserBox[]> {
  //   return this.userBoxesService.findAll(name, game_id);
  // }

  @Mutation(() => UserBox)
  update(@Args('updateUserBoxInput') updateUserBoxInput: UpdateUserBoxInput) {
    return this.userBoxesService.update(
      updateUserBoxInput.id,
      updateUserBoxInput.letter,
    );
  }
}
