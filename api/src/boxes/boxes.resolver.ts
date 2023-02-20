import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
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
    @Args('id', { type: () => String }) id: string,
    @Args('letter', { type: () => String, nullable: true })
    letter: string | null,
  ): Promise<Box> {
    return this.boxesService.update(id, letter);
  }

  @Mutation(() => Box)
  deleteBox(@Args('id', { type: () => String }) id: string): Promise<void> {
    return this.boxesService.delete(id);
  }

  @Query(() => Box, { name: 'box' })
  findOne(@Args('id', { type: () => String }) id: string): Promise<Box> {
    return this.boxesService.findOne(id);
  }
}
