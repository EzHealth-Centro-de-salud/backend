import { Module } from '@nestjs/common';
import { MedicalRecordService } from './medical_record.service';
import { MedicalRecordResolver } from './medical_record.resolver';

@Module({
  providers: [MedicalRecordResolver, MedicalRecordService],
})
export class MedicalRecordModule {}
