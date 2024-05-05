import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Branch } from './branch.entity';

@Entity()
@ObjectType()
@Unique(['box', 'branch'])
export class Box {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field((type) => Int)
  box: number;

  @ManyToOne(() => Branch, (branch) => branch.boxes)
  @JoinColumn({ name: 'id_branch' })
  branch: Branch;
}

@ObjectType()
export class BoxResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
