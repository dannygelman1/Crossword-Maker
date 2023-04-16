import { Module } from '@nestjs/common';
import { UserBoxesService } from './user_boxes.service';
import { UserBoxesResolver } from './user_boxes.resolver';
import { UserBox } from './entities/user_box.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserBox])],
  providers: [UserBoxesResolver, UserBoxesService],
  exports: [UserBoxesService],
})
export class UserBoxesModule {}
