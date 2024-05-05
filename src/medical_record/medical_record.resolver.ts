import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MedicalRecordService } from './medical_record.service';
import { MedicalRecord } from './entities/medical_record.entity';

@Resolver(() => MedicalRecord)
export class MedicalRecordResolver {
  constructor(private readonly medicalRecordService: MedicalRecordService) {}
}
