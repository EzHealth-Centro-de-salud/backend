import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreatePatientInput,
  CreatePersonnelInput,
} from './dto/create-user.input';
import { UserResponse, Patient, Personnel } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Personnel)
    private personnelRepository: Repository<Personnel>,
  ) {}

  //Other Methods
  async isValidRut(rut: string): Promise<string> {
    const value = rut.replace(/\./g, '').replace(/-/g, '');
    const body = value.slice(0, -1);
    const dv = value.slice(-1).toUpperCase();

    let counter = 0;
    let multiple = 2;

    for (let i = body.length - 1; i >= 0; i--) {
      counter = counter + parseInt(body.charAt(i)) * multiple;
      multiple = multiple < 7 ? multiple + 1 : 2;
    }

    const expectedDv = 11 - (counter % 11);
    if (
      (expectedDv === 10 && dv !== 'K') ||
      (expectedDv === 11 && dv !== '0') ||
      dv !== expectedDv.toString()
    ) {
      throw new Error('Rut inválido.');
    }
    return value;
  }

  //Patient Methods
  async getPatientByRut(rut: string): Promise<Patient> {
    const validRut = await this.isValidRut(rut);
    return this.patientRepository.findOne({ where: { rut: validRut } });
  }

  async createPatient(input: CreatePatientInput): Promise<UserResponse> {
    const patient = await this.getPatientByRut(input.rut);

    if (patient) {
      throw new Error('Paciente ya registrado.');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const newPatient = this.patientRepository.create({
      ...input,
      rut: await this.isValidRut(input.rut),
      password: hashedPassword,
    });

    this.patientRepository.save(newPatient);

    const success = true;
    const message = 'Paciente creado exitosamente.';
    const response = { success, message };

    return response;
  }

  //Personnel Methods
  async getPersonnelByRut(rut: string): Promise<Personnel> {
    const validRut = await this.isValidRut(rut);
    return this.personnelRepository.findOne({ where: { rut: validRut } });
  }

  async createPersonnel(input: CreatePersonnelInput): Promise<UserResponse> {
    const personnel = await this.getPersonnelByRut(input.rut);

    if (personnel) {
      throw new Error('Personal ya registrado.');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const newPersonnel = this.personnelRepository.create({
      ...input,
      rut: await this.isValidRut(input.rut),
      password: hashedPassword,
    });

    this.personnelRepository.save(newPersonnel);

    const success = true;
    const message = 'Personal creado exitosamente.';
    const response = { success, message };

    return response;
  }
}
