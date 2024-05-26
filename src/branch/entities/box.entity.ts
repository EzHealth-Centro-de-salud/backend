import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Branch } from './branch.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';

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
  @Field(() => Branch)
  branch: Branch;

  @OneToMany(() => Appointment, (appointment) => appointment.box)
  @Field((type) => [Appointment])
  appointments: Appointment[];

  @Column()
  @Field((type) => Boolean)
  is_active: boolean;
}

@ObjectType()
export class BoxResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
