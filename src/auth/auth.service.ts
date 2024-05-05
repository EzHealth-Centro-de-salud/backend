import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import {
  Patient,
  Personnel,
  UserResponse,
} from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginInput } from './dto/login-user.input';
import { JwtService } from '@nestjs/jwt';
import {
  ChangePasswordInput,
  RecoveryUserInput,
  ValidateRecoveryUserInput,
} from './dto/recovery-user.input';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Personnel)
    private personnelRepository: Repository<Personnel>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async loginPatient(input: LoginInput): Promise<Patient> {
    const patient = await this.userService.getPatientByRut(input.rut);

    if (!patient) {
      throw new Error('Credenciales incorrectas.');
    }

    const validPassword = await bcrypt.compare(
      input.password,
      patient.password,
    );

    if (!validPassword) {
      throw new Error('Credenciales incorrectas.');
    }

    const payload = { rut: patient.rut, sub: patient.id, role: 'patient' };
    patient.access_token = this.jwtService.sign(payload);
    patient.recovery_code = null;

    this.patientRepository.save(patient);

    return patient;
  }

  async loginPersonnel(input: LoginInput): Promise<Personnel> {
    const personnel = await this.userService.getPersonnelByRut(input.rut);

    if (!personnel) {
      throw new Error('Credenciales incorrectas.');
    }

    const validPassword = await bcrypt.compare(
      input.password,
      personnel.password,
    );

    if (!validPassword) {
      throw new Error('Credenciales incorrectas.');
    }

    const payload = {
      rut: personnel.rut,
      sub: personnel.id,
      role: 'personnel',
    };
    personnel.access_token = this.jwtService.sign(payload);
    personnel.recovery_code = null;

    this.personnelRepository.save(personnel);

    return personnel;
  }

  async generateRecoveryPass(): Promise<number> {
    const code = Math.floor(100000 + Math.random() * 900000);
    const pacient = await this.patientRepository.findOne({
      where: {
        recovery_code: code,
      },
    });
    const personnel = await this.personnelRepository.findOne({
      where: {
        recovery_code: code,
      },
    });
    if (!pacient && !personnel) {
      return code;
    } else {
      return this.generateRecoveryPass();
    }
  }

  async recoveryPatient(
    recoveryUserInput: RecoveryUserInput,
  ): Promise<Boolean> {
    const validRut = await this.userService.isValidRut(recoveryUserInput.rut);
    const patient = await this.patientRepository.findOne({
      where: { rut: validRut },
    });

    if (!patient) {
      return true;
    }

    const nodemailer = require('nodemailer');
    const client = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const code = await this.generateRecoveryPass();

    client.sendMail(
      {
        from: 'Soporte de EzHealt',
        to: patient.email,
        subject: 'Codigo de recuperacion de contraseña',
        html: `
          <h1>Restablecimiento de contraseña de la cuenta EzHealth</h1>
          <p>Hola </p> <strong>${patient.first_name} ${patient.surname}</strong>
          <p>Hemos recibido una solicitud para restablecer la contraseña de su cuenta como paciente.</p>
          <p>El codigo para restablecer su contraseña es: </p> <strong>${code}</strong>
          <p>Gracias,</p>
          <p>El equipo de EzHealth</p>
        `,
      },
      (error) => {
        if (error) {
          throw new Error('Error al enviar el correo');
        } else {
          patient.recovery_code = code;
          this.patientRepository.save(patient);
        }
      },
    );
    return true;
  }

  async recoveryPersonnel(
    recoveryUserInput: RecoveryUserInput,
  ): Promise<Boolean> {
    const validRut = await this.userService.isValidRut(recoveryUserInput.rut);
    const personnel = await this.personnelRepository.findOne({
      where: { rut: validRut },
    });

    if (!personnel) {
      return true;
    }

    const nodemailer = require('nodemailer');
    const client = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const code = await this.generateRecoveryPass();

    client.sendMail(
      {
        from: '"Soporte de EzHealth" <noreply@ezhealth.com>',
        to: personnel.email,
        subject: 'Codigo de recuperacion de contraseña',
        html: `
          <h1>Restablecimiento de contraseña de la cuenta EzHealth</h1>
          <p>Hola </p> <strong>${personnel.first_name} ${personnel.surname}</strong>
          <p>Hemos recibido una solicitud para restablecer la contraseña de su cuenta como medico.</p>
          <p>El codigo para restablecer su contraseña es: </p> <strong>${code}</strong>
          <p>Gracias,</p>
          <p>El equipo de EzHealth</p>
        `,
      },
      (error) => {
        if (error) {
          throw new Error('Error al enviar el correo');
        } else {
          personnel.recovery_code = code;
          this.personnelRepository.save(personnel);
        }
      },
    );
    return true;
  }

  async validateRecovery(
    recoveryUserInput: ValidateRecoveryUserInput,
  ): Promise<UserResponse> {
    const code = recoveryUserInput.recoveryPass;
    const pacient = await this.patientRepository.findOne({
      where: {
        recovery_code: code,
      },
    });
    const personnel = await this.personnelRepository.findOne({
      where: {
        recovery_code: code,
      },
    });
    if (!pacient && !personnel) {
      throw new Error('Codigo invalido');
    } else {
      const response = { success: true, message: 'Codigo valido' };
      return response;
    }
  }

  async changePasswordPatient(
    recoveryUserInput: ChangePasswordInput,
  ): Promise<UserResponse> {
    const rut = await this.userService.isValidRut(recoveryUserInput.rut);
    const patient = await this.patientRepository.findOne({
      where: { rut },
    });
    patient.password = await bcrypt.hash(recoveryUserInput.newPassword, 10);
    patient.recovery_code = null;
    this.patientRepository.save(patient);

    const success = true;
    const message = 'Contraseña cambiada con exito.';
    const response = { success, message };

    return response;
  }

  async changePasswordPersonnel(
    recoveryUserInput: ChangePasswordInput,
  ): Promise<UserResponse> {
    const rut = await this.userService.isValidRut(recoveryUserInput.rut);
    const personnel = await this.patientRepository.findOne({
      where: { rut },
    });
    personnel.password = await bcrypt.hash(recoveryUserInput.newPassword, 10);
    personnel.recovery_code = null;
    this.patientRepository.save(personnel);

    const success = true;
    const message = 'Contraseña cambiada con exito.';
    const response = { success, message };

    return response;
  }
}
