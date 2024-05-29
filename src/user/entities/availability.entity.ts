import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Personnel } from './user.entity';

@Entity()
@ObjectType()
@Unique(['day', 'turn', 'personnel'])
export class Availability {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  day: string;

  @Column()
  @Field()
  turn: string;

  @ManyToOne(() => Personnel, (personnel) => personnel.availability)
  @JoinColumn({ name: 'id_personnel' })
  @Field((type) => Personnel)
  personnel: Personnel;
}

@ObjectType()
export class AvailabilityResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
