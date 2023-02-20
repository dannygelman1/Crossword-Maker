import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoxesResolver } from './boxes.resolver';
import { BoxesService } from './boxes.service';
import { Box } from './entities/box.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Box])],
  providers: [BoxesResolver, BoxesService],
  exports: [BoxesService],
})
export class BoxesModule {}
