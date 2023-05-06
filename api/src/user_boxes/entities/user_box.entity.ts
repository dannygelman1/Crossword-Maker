import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Box } from 'src/boxes/entities/box.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity('user_boxes')
export class UserBox {
  @Field(() => ID, { description: 'ID of the box.' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field({ description: 'ID of the box.' })
  @Column({ name: 'box_id' })
  boxId!: string;

  @Field({ description: 'Name of user.' })
  @Column({ name: 'name' })
  name!: string;

  @Field({ description: 'Letter in the box.', nullable: true })
  @Column({ name: 'letter', nullable: true })
  letter?: string;

  @ManyToOne(() => Box, (box) => box.userBoxes)
  @JoinColumn({ name: 'box_id' })
  box: Box;

  @Field({ description: 'Creation timestamp of the game.' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @Field({ description: 'Last updated timestamp of the game.' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
