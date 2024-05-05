import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Branch } from 'src/branch/entities/branch.entity';

@Entity()
@ObjectType()
@Unique(['rut'])
export class Patient {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  access_token: string | null;

  @Column({ nullable: true })
  @Field({ nullable: true })
  recovery_code: number | null;

  @Column({ length: 12 })
  @Field()
  rut: string;

  @Column({ length: 128 })
  @Field()
  password: string;

  @Column()
  @Field()
  birthdate: string;

  @Column({ length: 50 })
  @Field()
  first_name: string;

  @Column({ length: 50, nullable: true })
  @Field({ nullable: true })
  middle_name: string | null;

  @Column({ length: 50 })
  @Field()
  surname: string;

  @Column({ length: 50, nullable: true })
  @Field({ nullable: true })
  second_surname: string | null;

  @Column({ length: 20 })
  @Field()
  sex: string;

  @Column({ length: 100 })
  @Field()
  address: string;

  @Column({ length: 60 })
  @Field()
  region: string;

  @Column({ length: 60 })
  @Field()
  commune: string;

  @Column({ length: 254 })
  @Field()
  email: string;

  @Column({ length: 9 })
  @Field()
  phone: string;
}

@Entity()
@ObjectType()
@Unique(['rut'])
export class Personnel {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  access_token: string | null;

  @Column({ nullable: true })
  @Field({ nullable: true })
  recovery_code: number | null;

  @Column({ length: 12 })
  @Field()
  rut: string;

  @Column({ length: 128 })
  @Field()
  password: string;

  @Column({ length: 50 })
  @Field()
  first_name: string;

  @Column({ length: 50, nullable: true })
  @Field({ nullable: true })
  middle_name: string | null;

  @Column({ length: 50 })
  @Field()
  surname: string;

  @Column({ length: 50, nullable: true })
  @Field({ nullable: true })
  second_surname: string | null;

  @Column({ length: 254 })
  @Field()
  email: string;

  @Column({ length: 45 })
  @Field()
  role: string;

  @Column({ length: 100 })
  @Field()
  speciality: string;

  @ManyToOne(() => Branch, (branch) => branch.boxes)
  @JoinColumn({ name: 'id_branch' })
  branch: Branch;
}

@ObjectType()
export class UserResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
