import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GamesService } from './games.service';
import { Game } from './entities/game.entity';
import { CreateGameInput } from './dto/create-game.input';

@Resolver(() => Game)
export class GamesResolver {
  constructor(private readonly gamesService: GamesService) {}

  @Mutation(() => Game)
  createGame(
    @Args('createGameInput') createGameInput: CreateGameInput,
  ): Promise<Game> {
    return this.gamesService.create(createGameInput);
  }

  @Query(() => Game)
  findGame(
    @Args('slug', {
      type: () => String,
      description: 'slug of the game.',
      nullable: true,
    })
    slug: string,
  ): Promise<Game | null> {
    return this.gamesService.findOne(slug);
  }
}
