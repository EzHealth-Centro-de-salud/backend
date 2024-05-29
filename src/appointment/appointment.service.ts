import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Equal } from 'typeorm';
import {
  Appointment,
  AppointmentResponse,
} from './entities/appointment.entity';
import { CreateAppointmentInput } from './dto/create-appointment.input';
import { Personnel } from 'src/user/entities/user.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
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
    const appointment = await this.appointmentRepository.findOne({
      where: { date_time: input.date_time },
    });

    if (appointment) {
      throw new Error('Cita ya registrada');
    }

    const newAppointment = this.appointmentRepository.create({
      ...input,
      status: 'pending',
    });

    await this.appointmentRepository.save(newAppointment);

    const success = true;
    const message = 'Cita creada exitosamente';
    const response = { success, message };

    return response;
  }
}
