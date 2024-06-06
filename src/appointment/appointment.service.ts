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
import { meses, semana } from 'src/constants/schedule';

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
    console.log(input);
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
      throw new Error('El medico ya tiene una cita en ese horario');
    }

    const scheduleInput = {
      id_personnel: input.id_personnel,
      date: input.date,
    };

    const schedule = await this.userService.checkSchedule(scheduleInput);

    const isAvailable = schedule.message.includes(input.time);

    if (!isAvailable) {
      throw new Error('El medico no tiene disponibilidad para ese horario');
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

    const nodemailer = require('nodemailer');
    const client = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const dayName = semana[new Date(input.date).getDay()];
    const dayNum = input.date.split('-')[2];
    const monthName = meses[new Date(input.date).getMonth()];

    client.sendMail(
      {
        from: '"EzHealth" <noreply@ezhealth.com>',
        to: personnel.email,
        subject: `Cita agendada ${input.date}`,
        html: `
          <h1>Cita agendada</h1>
          <p>Hola <strong>${personnel.first_name} ${personnel.surname}</strong> </p>
          <p>Se ha agendado una cita con <strong> ${patient.first_name} ${patient.surname} </strong> para el dia <strong> ${dayName} ${dayNum} de ${monthName} a las ${input.time} hrs. </strong> </p>
          <p>La atención se realizara en el box <strong> ${availableBox.box} </strong> </p>
          <p>Por favor, confirme la cita en el sistema</p>
          <p>Gracias,</p>
          <p>El equipo de EzHealth</p>
        `,
      },
      (error) => {
        if (error) {
          throw new Error('Error al enviar el correo');
        }
      },
    );

    client.sendMail(
      {
        from: '"EzHealth" <noreply@ezhealth.com>',
        to: patient.email,
        subject: `Cita agendada ${input.date}`,
        html: `
          <h1>Cita agendada exitosamente</h1>
          <p>Hola <strong>${patient.first_name} ${patient.surname}</strong> </p>
          <p>Su cita ha sido agendada exitosamente con <strong> ${personnel.first_name} ${personnel.surname} </strong> para el dia <strong> ${dayName} ${dayNum} de ${monthName} a las ${input.time} hrs. </strong> </p>
          <p>Gracias,</p>
          <p>El equipo de EzHealth</p>
        `,
      },
      (error) => {
        if (error) {
          throw new Error('Error al enviar el correo');
        }
      },
    );

    const success = true;
    const message = 'Cita creada exitosamente';
    const response = { success, message };

    return response;
  }
}
