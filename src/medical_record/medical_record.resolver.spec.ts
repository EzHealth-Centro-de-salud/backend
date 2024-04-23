import { Test, TestingModule } from '@nestjs/testing';
import { MedicalRecordResolver } from './medical_record.resolver';
import { MedicalRecordService } from './medical_record.service';

describe('MedicalRecordResolver', () => {
  let resolver: MedicalRecordResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalRecordResolver, MedicalRecordService],
    }).compile();

    resolver = module.get<MedicalRecordResolver>(MedicalRecordResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
