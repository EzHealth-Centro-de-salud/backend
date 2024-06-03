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
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => Int)
  box_count: number;

  @Column({ length: 100 })
  @Field()
  address: string;

  @OneToMany(() => Box, (box) => box.branch)
  @Field(() => [Box], { nullable: true })
  boxes: Box[];

  @OneToMany(() => Personnel, (personnel) => personnel.branch)
  @Field(() => [Personnel], { nullable: true })
  personnel: Personnel[];

  @Column()
  @Field(() => Boolean)
  is_active: boolean;
}

@ObjectType()
export class BranchResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
