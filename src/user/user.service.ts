import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePatientInput, CreatePersonnelInput} from './dto/create-user.input';
import { Patient, Personnel } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository : Repository<Patient>,
    @InjectRepository(Personnel)
    private personnelRepository : Repository<Personnel>,
    ){}

    async isValidRut(rut: string): Promise<string> {
      const value = rut.replace(/\./g, '').replace(/-/g, '');
      const body = value.slice(0, -1);
      const dv = value.slice(-1).toUpperCase();
    
      let counter = 0;
      let multiple = 2;
    
      for(let i = body.length - 1; i >= 0; i--) {
        counter = counter + parseInt(body.charAt(i)) * multiple;
        multiple = (multiple < 7) ? multiple + 1 : 2;
      }
    
      const expectedDv = 11 - (counter % 11);
      if (expectedDv === 10 && dv !== 'K' || expectedDv === 11 && dv !== '0' || dv !== expectedDv.toString()) {
        throw new Error('Rut inválido.')
      }
      return value;
    }

    async getPatientByRut(rut: string): Promise<Patient>{
      const validRut = await this.isValidRut(rut);
      return this.patientRepository.findOne({ where: { rut: validRut } });
    }

    async getPersonnelByRut(rut: string): Promise<Personnel>{
      const validRut = await this.isValidRut(rut);
      return this.personnelRepository.findOne({ where: { rut: validRut } });
    }

    async createPatient(input: CreatePatientInput): Promise<Patient> {
      const patient = await this.getPatientByRut(input.rut);
      
      if(patient){
        throw new Error('Paciente ya registrado.');
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);
      const newPatient = this.patientRepository.create({
        ...input,
        rut: await this.isValidRut(input.rut),
        password: hashedPassword,
      });

      return this.patientRepository.save(newPatient);
    }

    async createPersonnel(input: CreatePersonnelInput): Promise<Personnel> {
      const personnel = await this.getPersonnelByRut(input.rut);
      
      if(personnel){
        throw new Error('Personal ya registrado.');
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);
      const newPersonnel = this.personnelRepository.create({
        ...input,
        rut: await this.isValidRut(input.rut),
        password: hashedPassword,
      });

      return this.personnelRepository.save(newPersonnel);
    }

}
