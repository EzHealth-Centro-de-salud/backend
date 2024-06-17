import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Branch } from 'src/branch/entities/branch.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { MedicalRecord } from 'src/medical_record/entities/medical_record.entity';
import { Availability } from './availability.entity';

@Entity()
@ObjectType()
@Unique(['rut'])
export class Patient {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  access_token: string | null;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
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

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  @Field(() => [Appointment], { nullable: true })
  appointments: Appointment[];

  @OneToMany(() => MedicalRecord, (medical_record) => medical_record.patient)
  @Field(() => [MedicalRecord], { nullable: true })
  medical_records: MedicalRecord[];

  @Column()
  @Field(() => Boolean)
  is_active: boolean;
}

@Entity()
@ObjectType()
@Unique(['rut'])
export class Personnel {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  access_token: string | null;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
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

  @ManyToOne(() => Branch, (branch) => branch.personnel)
  @JoinColumn({ name: 'id_branch' })
  @Field(() => Branch, { nullable: true })
  branch: Branch;

  @OneToMany(() => Appointment, (appointment) => appointment.personnel)
  @Field(() => [Appointment], { nullable: true })
  appointments: Appointment[];

  @OneToMany(() => MedicalRecord, (medical_record) => medical_record.personnel)
  @Field(() => [MedicalRecord], { nullable: true })
  medical_records: MedicalRecord[];

  @OneToMany(() => Availability, (availability) => availability.personnel)
  @Field(() => [Availability], { nullable: true })
  availability: Availability[];

  @Column()
  @Field(() => Boolean)
  is_active: boolean;
}

@ObjectType()
export class UserResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
