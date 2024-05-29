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
import { Box } from 'src/branch/entities/box.entity';
import { Patient, Personnel } from 'src/user/entities/user.entity';

@Entity()
@ObjectType()
@Unique(['date_time', 'box'])
export class Appointment {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  date_time: string;

  @Column({ length: 100 })
  @Field()
  type: string;

  @Column({ length: 20 })
  @Field()
  status: string;

  @ManyToOne(() => Box, (box) => box.appointments)
  @JoinColumn({ name: 'id_box' })
  @Field(() => Box)
  box: Box;

  @ManyToOne(() => Patient, (patient) => patient.appointments)
  @JoinColumn({ name: 'id_patient' })
  @Field(() => Patient)
  patient: Patient;

  @ManyToOne(() => Personnel, (personnel) => personnel.appointments)
  @JoinColumn({ name: 'id_personnel' })
  @Field(() => Personnel)
  personnel: Personnel;
}

@ObjectType()
export class AppointmentResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
