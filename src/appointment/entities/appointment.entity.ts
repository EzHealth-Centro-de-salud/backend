import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Box } from 'src/branch/entities/box.entity';
import { Patient, Personnel } from 'src/user/entities/user.entity';
import { MedicalRecord } from 'src/medical_record/entities/medical_record.entity';

@Entity()
@ObjectType()
@Unique(['date', 'time', 'personnel', 'patient'])
export class Appointment {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  date: string;

  @Column()
  @Field()
  time: string;

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

  @OneToOne(() => MedicalRecord, (medicalRecord) => medicalRecord.appointment)
  @JoinColumn({ name: 'id_medical_record' })
  @Field(() => MedicalRecord, { nullable: true })
  medical_record: MedicalRecord;
}

@ObjectType()
export class AppointmentResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
