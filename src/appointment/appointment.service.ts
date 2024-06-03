import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Equal } from 'typeorm';
import {
  Appointment,
  AppointmentResponse,
} from './entities/appointment.entity';
import { CreateAppointmentInput } from './dto/create-appointment.input';
import { BranchService } from 'src/branch/branch.service';
import { UserService } from 'src/user/user.service';
import { Branch } from 'src/branch/entities/branch.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    private userService: UserService,
    private branchService: BranchService,
  ) {}
  //------------------------------------Other Methods------------------------------------

  //------------------------------------Appointment Methods------------------------------------
  async getAppointment(id: number): Promise<Appointment> {
    return await this.appointmentRepository.findOne({ where: { id } });
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return await this.appointmentRepository.find();
  }

  async createAppointment(
    input: CreateAppointmentInput,
  ): Promise<AppointmentResponse> {
    const patient = await this.userService.getPatient(input.id_patient);
    if (!patient) {
      throw new Error('El paciente no existe');
    }

    const personnel = await this.userService.getPersonnel(input.id_personnel);
    if (!personnel) {
      throw new Error('El profesional no existe');
    }

    const appointmentPatientFound = await this.appointmentRepository.findOne({
      where: {
        patient: patient,
        date: input.date,
        time: input.time,
      },
    });

    if (appointmentPatientFound) {
      throw new Error('El paciente ya tiene una cita en ese horario');
    }

    const appointmentPersonnelFound = await this.appointmentRepository.findOne({
      where: {
        personnel: personnel,
        date: input.date,
        time: input.time,
      },
    });

    if (appointmentPersonnelFound) {
      throw new Error('El profesional ya tiene una cita en ese horario');
    }

    const scheduleInput = {
      id_personnel: input.id_personnel,
      date: input.date,
    };

    const schedule = await this.userService.checkSchedule(scheduleInput);

    const isAvailable = schedule.message.includes(input.time);

    if (!isAvailable) {
      throw new Error(
        'El profesional ya no tiene disponibilidad para ese horario',
      );
    }

    const appointments = await this.appointmentRepository.find({
      where: {
        date: input.date,
        time: input.time,
        box: { branch: personnel.branch },
      },
      relations: ['box'],
    });

    let availableBox = null;
    const branch = await this.branchService.getBranch(personnel.branch.id);

    if (appointments.length > 0) {
      const occupiedBoxIds = appointments.map((app) => app.box.id);

      availableBox = branch.boxes.find(
        (box) => !occupiedBoxIds.includes(box.id),
      );

      if (!availableBox) {
        throw new Error('No hay boxes disponibles');
      }
    } else {
      availableBox = branch.boxes[0];
    }

    const newAppointment = this.appointmentRepository.create({
      date: input.date,
      time: input.time,
      type: input.type,
      box: availableBox,
      patient,
      personnel,
      status: 'Pendiente',
    });

    await this.appointmentRepository.save(newAppointment);

    const success = true;
    const message = 'Cita creada exitosamente';
    const response = { success, message };

    return response;
  }
}
