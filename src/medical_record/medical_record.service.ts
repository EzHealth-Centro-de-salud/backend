import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Equal } from 'typeorm';
import { MedicalRecord } from './entities/medical_record.entity';
import { CreateMedicalRecordInput } from './dto/create-medical-record.input';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Patient, Personnel } from 'src/user/entities/user.entity';

@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectRepository(MedicalRecord)
    private mrRepository: Repository<MedicalRecord>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Personnel)
    private personnelRepository: Repository<Personnel>,
  ) {}

  async createMedicalRecord(
    appointment: Appointment,
    personnel: Personnel,
    patient: Patient,
    diagnosis: string,
    prescription: string,
  ): Promise<MedicalRecord> {
    const dateTime = new Date().toISOString();
    const medicalRecord = this.mrRepository.create({
      diagnosis,
      prescription,
      appointment,
      patient,
      personnel,
      date_time: dateTime,
    });
    return this.mrRepository.save(medicalRecord);
  }
}
