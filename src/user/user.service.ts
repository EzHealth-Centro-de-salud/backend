import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreatePatientInput,
  CreatePersonnelInput,
} from './dto/create-user.input';
import { UserResponse, Patient, Personnel } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { BranchService } from 'src/branch/branch.service';
import * as dotenv from 'dotenv';
import {
  Availability,
  AvailabilityResponse,
} from './entities/availability.entity';
import { AssignAvailabilityInput } from './dto/assign-availability.input';

dotenv.config();

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Personnel)
    private personnelRepository: Repository<Personnel>,
    @InjectRepository(Availability)
    private availabilityRepository: Repository<Availability>,
    private branchService: BranchService,
  ) {}

  //------------------------------------Other Methods------------------------------------
  async onModuleInit() {
    const found1 = await this.personnelRepository.findOne({
      where: { role: 'admin' },
    });
    if (!found1) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, 10);
      const admin = this.personnelRepository.create({
        rut: process.env.ADMIN_RUT,
        password: hashedPassword,
        first_name: process.env.ADMIN_FIRST_NAME,
        surname: process.env.ADMIN_SURNAME,
        email: process.env.ADMIN_EMAIL,
        role: 'admin',
        speciality: 'admin',
        is_active: true,
      });

      this.personnelRepository.save(admin);
    }
  }

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

    let expectedDv: string | number = 11 - (counter % 11);
    if (expectedDv === 10) expectedDv = 'K';
    else if (expectedDv === 11) expectedDv = '0';
    else expectedDv = expectedDv.toString();

    if (dv !== expectedDv) {
      throw new Error('Rut inválido.');
    }
    return value;
  }

  //------------------------------------Patient Methods------------------------------------
  async uniqueRUT(rut: string): Promise<UserResponse> {
    const validRut = await this.isValidRut(rut);
    const patient = await this.patientRepository.findOne({
      where: { rut: validRut },
    });

    if (patient) {
      throw new Error('Paciente ya registrado.');
    }

    const success = true;
    const message = 'Rut válido.';
    const response = { success, message };

    return response;
  }
  async getPatientByRut(rut: string): Promise<Patient> {
    const validRut = await this.isValidRut(rut);
    return this.patientRepository.findOne({ where: { rut: validRut } });
  }

  async getPatient(id: number): Promise<Patient> {
    return await this.patientRepository.findOne({ where: { id } });
  }

  async getAllPatients(): Promise<Patient[]> {
    return this.patientRepository.find();
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
      is_active: true,
    });

    this.patientRepository.save(newPatient);

    const success = true;
    const message = 'Paciente creado exitosamente.';
    const response = { success, message };

    return response;
  }

  //------------------------------------Personnel Methods------------------------------------
  async getPersonnelByRut(rut: string): Promise<Personnel> {
    const validRut = await this.isValidRut(rut);
    return this.personnelRepository.findOne({ where: { rut: validRut } });
  }

  async getPersonnelByBranch(id_branch: number): Promise<Personnel[]> {
    return this.personnelRepository.find({
      where: { branch: { id: id_branch } },
    });
  }

  async getPersonnel(id: number): Promise<Personnel> {
    return await this.personnelRepository.findOne({ where: { id } });
  }

  async getAllPersonnel(): Promise<Personnel[]> {
    return this.personnelRepository.find();
  }

  async createPersonnel(input: CreatePersonnelInput): Promise<UserResponse> {
    const personnel = await this.getPersonnelByRut(input.rut);

    if (personnel) {
      throw new Error('Personal ya registrado.');
    }

    const branch = await this.branchService.getBranch(input.id_branch);

    if (!branch) {
      throw new Error('Sucursal no encontrada.');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    let newPersonnel = null;
    if (input.role === 'admin') {
      newPersonnel = this.personnelRepository.create({
        ...input,
        rut: await this.isValidRut(input.rut),
        password: hashedPassword,
        is_active: true,
      });
    } else {
      newPersonnel = this.personnelRepository.create({
        ...input,
        rut: await this.isValidRut(input.rut),
        password: hashedPassword,
        is_active: true,
        branch,
      });
    }

    this.personnelRepository.save(newPersonnel);

    const success = true;
    const message = 'Personal creado exitosamente.';
    const response = { success, message };

    return response;
  }

  //------------------------------------Availability Methods------------------------------------
  async getAvailabilityByPersonnel(
    id_personnel: number,
  ): Promise<Availability[]> {
    const personnel = await this.personnelRepository.findOne({
      where: { id: id_personnel },
      relations: ['availability'],
    });

    if (!personnel) {
      throw new Error('Personal no encontrado.');
    }

    return personnel.availability;
  }

  async assignAvailability(
    input: AssignAvailabilityInput,
  ): Promise<AvailabilityResponse> {
    const personnel = await this.personnelRepository.findOne({
      where: { id: input.id_personnel },
    });

    if (!personnel) {
      throw new Error('Personal no encontrado.');
    }

    const availability = JSON.parse(input.turns).semana;

    for (const turn of availability) {
      let availability = await this.availabilityRepository.findOne({
        where: { personnel: { id: input.id_personnel }, day: turn.dia },
      });
      if (availability) {
        availability.turn = turn.turno;
        await this.availabilityRepository.save(availability);
      } else {
        availability = this.availabilityRepository.create({
          personnel,
          day: turn.dia,
          turn: turn.turno,
        });
        await this.availabilityRepository.save(availability);
      }
    }

    const success = true;
    const message = 'Disponibilidad asignada exitosamente.';
    const response = { success, message };

    return response;
  }
}
