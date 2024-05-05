import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Box } from './box.entity';
import { Personnel } from 'src/user/entities/user.entity';

@Entity()
@ObjectType()
@Unique(['address'])
export class Branch {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field((type) => Int)
  box_count: number;

  @Column({ length: 100 })
  @Field()
  address: string;

  @OneToMany(() => Box, (box) => box.branch)
  boxes: Box[];

  @OneToMany(() => Personnel, (personnel) => personnel.branch)
  personnel: Personnel[];
}

@ObjectType()
export class BranchResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
