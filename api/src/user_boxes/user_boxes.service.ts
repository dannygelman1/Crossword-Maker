import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Box } from 'src/boxes/entities/box.entity';
import { Repository } from 'typeorm/repository/Repository';
import { CreateUserBoxInput } from './dto/create-user_box.input';
import { UpdateUserBoxInput } from './dto/update-user_box.input';
import { UserBox } from './entities/user_box.entity';

@Injectable()
export class UserBoxesService {
  constructor(
    @InjectRepository(UserBox)
    private userBoxRepository: Repository<UserBox>,
  ) {}

  async create(createUserBoxInput: CreateUserBoxInput): Promise<UserBox> {
    let userBox = new UserBox();

    userBox.boxId = createUserBoxInput.boxId;
    userBox.name = createUserBoxInput.name;
    userBox.letter = createUserBoxInput.letter;

    userBox = await this.userBoxRepository.save(userBox);
    return userBox;
  }

  async findAll(name: string, game_id: string): Promise<UserBox[]> {
    return this.userBoxRepository
      .createQueryBuilder('userBox')
      .leftJoinAndSelect('userBox.box', 'box')
      .where('userBox.name = :name', { name })
      .andWhere('box.game_id = :gameId', { gameId: game_id })
      .getMany();
  }

  async update(id: string, letter?: string): Promise<UserBox> {
    await this.userBoxRepository.update({ id }, { letter });
    return this.userBoxRepository.findOneBy({ id });
  }
}
