import { Injectable } from '@nestjs/common';
import { CreateGameInput } from './dto/create-game.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { DataSource, Repository } from 'typeorm';
import { Box } from 'src/boxes/entities/box.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
    private dataSource: DataSource,
  ) {}

  async create(createGameInput: CreateGameInput): Promise<Game> {
    return this.dataSource.transaction(async (manager) => {
      const game = manager.create(Game, {
        slug: createGameInput.slug,
      });
      await manager.save(game);

      const box = manager.create(Box, {
        game_id: game.slug,
        x: 0,
        y: 0,
        isblock: false,
      });
      await manager.save(box);
      return game;
    });
  }

  async findOne(slug: string): Promise<Game | null> {
    return this.gamesRepository.findOneBy({ slug });
  }
}
