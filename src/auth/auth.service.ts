import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Patient, Personnel } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginInput } from './dto/login-user.input';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Patient)
        private patientRepository: Repository<Patient>,
        @InjectRepository(Personnel)
        private personnelRepository: Repository<Personnel>,
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async loginPatient (input: LoginInput): Promise<Patient> {
        const patient = await this.userService.getPatientByRut(input.rut);

        if (!patient) {
            throw new Error('Credenciales incorrectas.');
        }

        const validPassword = await bcrypt.compare(input.password, patient.password);

        if (!validPassword) {
            throw new Error('Credenciales incorrectas.');
        }

        const payload = { rut: patient.rut, sub: patient.id };
        patient.access_token = this.jwtService.sign(payload);

        this.patientRepository.save(patient);

        return patient;
    }

    async loginPersonnel (input: LoginInput): Promise<Personnel> {
        const personnel = await this.userService.getPersonnelByRut(input.rut);

        if (!personnel) {
            throw new Error('Credenciales incorrectas.');
        }

        const validPassword = await bcrypt.compare(input.password, personnel.password);

        if (!validPassword) {
            throw new Error('Credenciales incorrectas.');
        }

        const payload = { rut: personnel.rut, sub: personnel.id };
        personnel.access_token = this.jwtService.sign(payload);

        this.patientRepository.save(personnel);

        return personnel;

    }
}
