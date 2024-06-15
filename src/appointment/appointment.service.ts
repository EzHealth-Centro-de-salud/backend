import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Equal } from 'typeorm';
import * as cron from 'node-cron';
import {
  Appointment,
  AppointmentResponse,
} from './entities/appointment.entity';
import { CreateAppointmentInput } from './dto/create-appointment.input';
import { BranchService } from 'src/branch/branch.service';
import { UserService } from 'src/user/user.service';
import { Branch } from 'src/branch/entities/branch.entity';
import { meses, semana } from 'src/constants/schedule';
import { NotificationService } from 'src/notification/notification.service';
import { ConfirmAppointmentInput } from './dto/confirm-appointment.input';
import { CompleteAppointmentInput } from './dto/complete-appointment.input';
import { MedicalRecordService } from 'src/medical_record/medical_record.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    private userService: UserService,
    private branchService: BranchService,
    private notificationService: NotificationService,
    private medicalRecordService: MedicalRecordService,
  ) {}
  //------------------------------------Other Methods------------------------------------
  schedule_app = cron.schedule('0,30 * * * *', () => {
    console.log('Tarea ejecutada cada minuto 0 y 30');
    // Lógica de tu tarea aquí
  });
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

    //Send notification to patient and personnel
    const patient_notif_id = patient.id;
    this.notificationService.sendNotification(
      patient_notif_id.toString(),
      'Cita agendada',
      `Su cita ha sido agendada para el dia ${dayName} ${dayNum} de ${monthName} a las ${input.time} hrs.`,
    );

    const personnel_notif_id = '-' + personnel.id.toString();
    this.notificationService.sendNotification(
      personnel_notif_id,
      'Cita agendada',
      `Tiene una cita agendada para el dia ${dayName} ${dayNum} de ${monthName} a las ${input.time} hrs.`,
    );

    const success = true;
    const message = 'Cita creada exitosamente';
    const response = { success, message };

    return response;
  }

  async confirmAppointment(
    input: ConfirmAppointmentInput,
  ): Promise<AppointmentResponse> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: input.id_appointment },
      relations: ['personnel', 'patient'],
    });

    if (!appointment) {
      throw new Error('La cita no existe');
    }

    if (appointment.status === 'Confirmada') {
      throw new Error('La cita ya ha sido confirmada');
    } else {
      if (appointment.status === 'Cancelada') {
        throw new Error('La cita ha sido cancelada');
      } else {
        if (appointment.status === 'Completada') {
          throw new Error('La cita ya ha sido completada');
        }
      }
    }

    if (appointment.personnel.id != input.id_personnel) {
      throw new Error('El profesional no corresponde a la cita');
    }

    appointment.status = 'Confirmada';
    await this.appointmentRepository.save(appointment);

    // Send email to patient
    const nodemailer = require('nodemailer');
    const client = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const dayName = semana[new Date(appointment.date).getDay()];
    const dayNum = appointment.date.split('-')[2];
    const monthName = meses[new Date(appointment.date).getMonth()];

    client.sendMail(
      {
        from: '"EzHealth" <noreply@ezhealth.com>',
        to: appointment.patient.email,
        subject: `Cita confirmada`,
        html: `
          <h1>Cita confirmada</h1>
          <p>Hola <strong>${appointment.patient.first_name} ${appointment.patient.surname}</strong> </p>
          <p>Su cita para el dia <strong> ${dayName} ${dayNum} de ${monthName} a las ${appointment.time} hrs </strong> ha sido confirmada por su médico. </p>
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

    //Send notification to patient
    const patient_notif_id = appointment.patient.id;
    this.notificationService.sendNotification(
      patient_notif_id.toString(),
      'Cita confirmada',
      `Su cita para el dia ${dayName} ${dayNum} de ${monthName} a las ${appointment.time} hrs ha sido confirmada por su médico.`,
    );

    const success = true;
    const message = 'Cita confirmada exitosamente';
    const response = { success, message };

    return response;
  }

  async completeAppointment(
    input: CompleteAppointmentInput,
  ): Promise<AppointmentResponse> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: input.id_appointment },
      relations: ['personnel', 'patient'],
    });

    if (!appointment) {
      throw new Error('La cita no existe');
    }

    if (appointment.status === 'Completada') {
      throw new Error('La cita ya ha sido completada');
    } else {
      if (appointment.status === 'Cancelada') {
        throw new Error('La cita ha sido cancelada');
      } else {
        if (appointment.status === 'Pendiente') {
          throw new Error('La cita no ha sido confirmada');
        }
      }
    }

    if (appointment.personnel.id != input.id_personnel) {
      throw new Error('El profesional no corresponde a la cita');
    }

    appointment.status = 'Completada';
    await this.appointmentRepository.save(appointment);

    await this.medicalRecordService.createMedicalRecord(
      appointment,
      appointment.personnel,
      appointment.patient,
      input.diagnosis,
      input.prescription,
    );

    const success = true;
    const message = 'Cita confirmada exitosamente';
    const response = { success, message };

    return response;
  }
}
