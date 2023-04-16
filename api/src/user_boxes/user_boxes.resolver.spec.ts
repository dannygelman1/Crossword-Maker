import { Test, TestingModule } from '@nestjs/testing';
import { UserBoxesResolver } from './user_boxes.resolver';
import { UserBoxesService } from './user_boxes.service';

describe('UserBoxesResolver', () => {
  let resolver: UserBoxesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserBoxesResolver, UserBoxesService],
    }).compile();

    resolver = module.get<UserBoxesResolver>(UserBoxesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
