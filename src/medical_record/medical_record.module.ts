import { Module } from '@nestjs/common';
import { MedicalRecordService } from './medical_record.service';
import { MedicalRecord } from './entities/medical_record.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Patient, Personnel } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicalRecord, Appointment, Patient, Personnel]),
  ],
  providers: [MedicalRecordService],
  exports: [MedicalRecordService],
})
export class MedicalRecordModule {}
