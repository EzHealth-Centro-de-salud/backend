import { Module } from '@nestjs/common';
import { MedicalRecordService } from './medical_record.service';
import { MedicalRecordResolver } from './medical_record.resolver';
import { MedicalRecord } from './entities/medical_record.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalRecord])],
  providers: [MedicalRecordResolver, MedicalRecordService],
  exports: [MedicalRecordService],
})
export class MedicalRecordModule {}
