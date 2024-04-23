import { Injectable } from '@nestjs/common';
import { CreateMedicalRecordInput } from './dto/create-medical_record.input';
import { UpdateMedicalRecordInput } from './dto/update-medical_record.input';

@Injectable()
export class MedicalRecordService {
  create(createMedicalRecordInput: CreateMedicalRecordInput) {
    return 'This action adds a new medicalRecord';
  }

  findAll() {
    return `This action returns all medicalRecord`;
  }

  findOne(id: number) {
    return `This action returns a #${id} medicalRecord`;
  }

  update(id: number, updateMedicalRecordInput: UpdateMedicalRecordInput) {
    return `This action updates a #${id} medicalRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} medicalRecord`;
  }
}
