import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { BoxesService } from './boxes.service';
import { Box } from './entities/box.entity';
import { CreateBoxInput } from './dto/create-box.input';
import { UpdateBoxInput } from './dto/update-box.input';

@Resolver(() => Box)
export class BoxesResolver {
  constructor(private readonly boxesService: BoxesService) {}

  @Mutation(() => Box)
  createBox(
    @Args('createBoxInput') createBoxInput: CreateBoxInput,
  ): Promise<Box> {
    return this.boxesService.create(createBoxInput);
  }

  @Mutation(() => Box)
  updateBox(
    @Args('updateBoxInput') updateBoxInput: UpdateBoxInput,
  ): Promise<Box> {
    return this.boxesService.update(updateBoxInput.id, updateBoxInput.letter);
  }

  @Mutation(() => ID)
  deleteBox(@Args('id', { type: () => String }) id: string): Promise<string> {
    return this.boxesService.delete(id);
  }

  @Query(() => Box, { name: 'box' })
  findOne(@Args('id', { type: () => String }) id: string): Promise<Box> {
    return this.boxesService.findOne(id);
  }
}
