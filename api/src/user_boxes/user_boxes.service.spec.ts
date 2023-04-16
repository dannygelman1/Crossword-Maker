import { Test, TestingModule } from '@nestjs/testing';
import { UserBoxesService } from './user_boxes.service';

describe('UserBoxesService', () => {
  let service: UserBoxesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserBoxesService],
    }).compile();

    service = module.get<UserBoxesService>(UserBoxesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
