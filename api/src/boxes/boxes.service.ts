import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Repository } from 'typeorm/repository/Repository';
import { CreateBoxInput } from './dto/create-box.input';
import { Box } from './entities/box.entity';

@Injectable()
export class BoxesService {
  constructor(
    @InjectRepository(Box)
    private boxesRepository: Repository<Box>,
  ) {}

  async create(createBoxInput: CreateBoxInput): Promise<Box> {
    let box = new Box();

    box.game_id = createBoxInput.game_id;
    box.x = createBoxInput.x;
    box.y = createBoxInput.y;
    box.isblock = createBoxInput.isblock;
    box = await this.boxesRepository.save(box);
    return box;
  }

  async update(id: string, letter?: string): Promise<Box> {
    await this.boxesRepository.update({ id }, { letter });
    return this.boxesRepository.findOneBy({ id });
  }

  async delete(id: string): Promise<string> {
    await this.boxesRepository.delete({ id });
    return id;
  }

  async findOne(id: string): Promise<Box> {
    return this.boxesRepository.findOneBy({ id });
  }

  async findAll(game_id: string): Promise<Box[]> {
    const boxes = await this.boxesRepository.find({ where: { game_id } });
    return boxes;
  }
}
