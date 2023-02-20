import { ObjectType, Field } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql/dist/scalars';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { Column } from 'typeorm/decorator/columns/Column';
import { CreateDateColumn } from 'typeorm/decorator/columns/CreateDateColumn';

import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { UpdateDateColumn } from 'typeorm/decorator/columns/UpdateDateColumn';

@ObjectType()
@Entity('games')
export class Game {
  @Field(() => ID, { description: 'ID of the game.' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field({ description: 'slug for the game.' })
  @Column({ name: 'slug' })
  slug!: string;

  @Field({ description: 'Creation timestamp of the game.' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @Field({ description: 'Last updated timestamp of the game.' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
