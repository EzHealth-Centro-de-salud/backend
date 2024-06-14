import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Patient, Personnel } from 'src/user/entities/user.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';

@Entity()
@ObjectType()
export class MedicalRecord {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ length: 255 })
  @Field()
  diagnosis: string;

  @Column({ length: 255 })
  @Field()
  prescription: string;

  @Column()
  @Field()
  date_time: string;

  @ManyToOne(() => Patient, (patient) => patient.medical_records)
  @JoinColumn({ name: 'id_patient' })
  @Field(() => Patient)
  patient: Patient;

  @ManyToOne(() => Personnel, (personnel) => personnel.medical_records)
  @JoinColumn({ name: 'id_personnel' })
  @Field(() => Personnel)
  personnel: Personnel;

  @OneToOne(() => Appointment, (appointment) => appointment.medical_record)
  @JoinColumn({ name: 'id_appointment' })
  @Field(() => Appointment)
  appointment: Appointment;
}
