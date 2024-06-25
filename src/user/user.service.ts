import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Equal, In } from 'typeorm';
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
import { semana, completo, mañana, tarde } from 'src/constants/schedule';
import { CheckScheduleInput } from './dto/check-schedule.input';
import { Appointment } from 'src/appointment/entities/appointment.entity';

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
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private branchService: BranchService,
  ) {}

  //------------------------------------Other Methods------------------------------------
  async onModuleInit() {
    const found = await this.personnelRepository.findOne({
      where: { role: 'admin' },
    });
    if (!found) {
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
      throw new Error('Rut inválido');
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
      throw new Error('Paciente ya registrado');
    }

    const success = true;
    const message = 'Rut válido.';
    const response = { success, message };

    return response;
  }

  async getPatientByRut(rut: string): Promise<Patient> {
    const validRut = await this.isValidRut(rut);
    return this.patientRepository.findOne({
      where: { rut: validRut },
      relations: [
        'appointments',
        'appointments.personnel',
        'appointments.patient',
        'medical_records',
        'medical_records.personnel',
      ],
    });
  }

  async getPatient(id: number): Promise<Patient> {
    return await this.patientRepository.findOne({
      where: { id },
      relations: [
        'appointments',
        'appointments.personnel',
        'appointments.patient',
        'medical_records',
        'medical_records.personnel',
        'medical_records.appointment',
        'medical_records.appointment.box',
        'medical_records.appointment.box.branch',
      ],
    });
  }

  async getAllPatients(): Promise<Patient[]> {
    return this.patientRepository.find({
      relations: [
        'appointments',
        'appointments.personnel',
        'appointments.patient',
        'medical_records',
        'medical_records.personnel',
        'medical_records.appointment',
        'medical_records.appointment.box',
        'medical_records.appointment.box.branch',
      ],
    });
  }

  async createPatient(input: CreatePatientInput): Promise<UserResponse> {
    const patient = await this.getPatientByRut(input.rut);

    if (patient) {
      throw new Error('Paciente ya registrado');
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
    const message = 'Paciente creado exitosamente';
    const response = { success, message };

    return response;
  }

  //------------------------------------Personnel Methods------------------------------------
  async getPersonnelByRut(rut: string): Promise<Personnel> {
    const validRut = await this.isValidRut(rut);
    return this.personnelRepository.findOne({
      where: { rut: validRut },
      relations: [
        'availability',
        'branch',
        'appointments',
        'appointments.personnel',
        'appointments.patient',
        'medical_records',
      ],
    });
  }

  async getPersonnelByBranch(id_branch: number): Promise<Personnel[]> {
    return this.personnelRepository.find({
      where: { branch: { id: id_branch }, role: Not(Equal('admin')) },
      relations: [
        'availability',
        'branch',
        'appointments',
        'appointments.personnel',
        'appointments.patient',
        'medical_records',
      ],
    });
  }

  async getPersonnelByAppointment(id_appointment: number): Promise<Personnel> {
    return this.personnelRepository.findOne({
      where: {
        appointments: { id: id_appointment },
        role: Not(Equal('admin')),
      },
      relations: [
        'availability',
        'branch',
        'appointments',
        'appointments.personnel',
        'appointments.patient',
        'medical_records',
      ],
    });
  }

  async getPersonnel(id: number): Promise<Personnel> {
    return await this.personnelRepository.findOne({
      where: { id, role: Not(Equal('admin')) },
      relations: [
        'availability',
        'branch',
        'appointments',
        'appointments.personnel',
        'appointments.patient',
        'medical_records',
      ],
    });
  }

  async getAllPersonnel(): Promise<Personnel[]> {
    return this.personnelRepository.find({
      where: { role: Not(Equal('admin')) },
      relations: [
        'availability',
        'branch',
        'appointments',
        'appointments.personnel',
        'appointments.patient',
        'medical_records',
      ],
    });
  }

  async createPersonnel(input: CreatePersonnelInput): Promise<UserResponse> {
    const personnel = await this.getPersonnelByRut(input.rut);

    if (personnel) {
      throw new Error('Personal ya registrado');
    }

    const branch = await this.branchService.getBranch(input.id_branch);

    if (!branch) {
      throw new Error('Sucursal no encontrada');
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
    const message = 'Personal creado exitosamente';
    const response = { success, message };

    return response;
  }

  //------------------------------------Availability Methods------------------------------------
  async checkSchedule(
    input: CheckScheduleInput,
  ): Promise<AvailabilityResponse> {
    const personnel = await this.getPersonnel(input.id_personnel);
    if (!personnel) {
      throw new Error('Personal no encontrado');
    }

    const patient = await this.getPatient(input.id_patient);
    if (!patient) {
      throw new Error('Paciente no encontrado');
    }

    // Filter appointments by date
    personnel.appointments = personnel.appointments.filter(
      (app) => app.date === input.date,
    );

    patient.appointments = patient.appointments.filter(
      (app) => app.date === input.date,
    );

    // Get turn by day name
    const date = new Date(input.date);
    const dayName = semana[date.getDay()];

    if (dayName === 'sábado' || dayName === 'domingo') {
      throw new Error('No hay atención los fines de semana');
    }

    const turn = personnel.availability.find((a) => a.day === dayName).turn;
    let schedule = null;

    if (turn === 'completo') {
      schedule = completo;
    } else if (turn === 'mañana') {
      schedule = mañana;
    } else if (turn === 'tarde') {
      schedule = tarde;
    } else {
      throw new Error('Sin disponibilidad');
    }

    // Filter schedule by current time
    const current = new Date();
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;

    if (currentDate === input.date) {
      console.log('today');
      schedule = schedule.filter((time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return (
          hours > current.getHours() ||
          (hours === current.getHours() && minutes > current.getMinutes())
        );
      });
    }

    // Filter schedule by appointments and status
    schedule = schedule.filter((time) => {
      const appointment = personnel.appointments.find(
        (app) => app.time === time,
      );
      return (
        !appointment ||
        appointment.status === 'Cancelada' ||
        appointment.status === 'Completada'
      );
    });

    schedule = schedule.filter((time) => {
      const appointment = patient.appointments.find((app) => app.time === time);
      return (
        !appointment ||
        appointment.status === 'Cancelada' ||
        appointment.status === 'Completada'
      );
    });

    // Filter schedule by boxes availability
    const appointments = await this.appointmentRepository.find({
      where: {
        date: input.date,
        status: In(['Pendiente', 'Confirmada']),
        box: { branch: personnel.branch },
      },
      relations: ['box'],
    });

    schedule = schedule.filter((time) => {
      const appointmentsCount = appointments.filter(
        (app) => app.time === time,
      ).length;

      return appointmentsCount < personnel.branch.box_count;
    });

    if (schedule.length === 0) throw new Error('Sin disponibilidad');

    const success = true;
    const message = JSON.stringify(schedule);
    const response = { success, message };

    return response;
  }

  async getAvailabilityByPersonnel(
    id_personnel: number,
  ): Promise<Availability[]> {
    const personnel = await this.personnelRepository.findOne({
      where: { id: id_personnel },
      relations: ['availability'],
    });

    if (!personnel) {
      throw new Error('Personal no encontrado');
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
      throw new Error('Personal no encontrado');
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
    const message = 'Disponibilidad asignada exitosamente';
    const response = { success, message };

    return response;
  }
}
