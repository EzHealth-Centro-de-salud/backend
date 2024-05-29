import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/middleware/jwt.auth.guard';
import { Roles, RolesGuard } from 'src/auth/decorators/role.guard';
import { AppointmentService } from './appointment.service';
import {
  Appointment,
  AppointmentResponse,
} from './entities/appointment.entity';
import { CreateAppointmentInput } from './dto/create-appointment.input';
import { Box } from 'src/branch/entities/box.entity';
import { Patient, Personnel } from 'src/user/entities/user.entity';
import { BranchService } from 'src/branch/branch.service';
import { UserService } from 'src/user/user.service';

@Resolver(() => Appointment)
export class AppointmentResolver {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly branchService: BranchService,
    private readonly userService: UserService,
  ) {}

  @Query(() => Appointment)
  async getAppointment(@Args('id', { type: () => Int }) id: number) {
    console.log('-> getAppointment');
    return await this.appointmentService.getAppointment(id);
  }

  @Query(() => [Appointment])
  async getAllAppointments() {
    console.log('-> getAppointments');
    return await this.appointmentService.getAllAppointments();
  }

  @Mutation(() => AppointmentResponse)
  async createAppointment(
    @Args('input') createAppointmentInput: CreateAppointmentInput,
  ) {
    console.log('-> createAppointment');
    try {
      return await this.appointmentService.createAppointment(
        createAppointmentInput,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @ResolveField((returns) => Box)
  async box(@Parent() appointment: Appointment): Promise<Box> {
    return await this.branchService.getBoxByAppointment(appointment.id);
  }

  @ResolveField((returns) => Personnel)
  async personnel(@Parent() appointment: Appointment): Promise<Personnel> {
    return await this.userService.getPersonnelByAppointment(appointment.id);
  }

  @ResolveField((returns) => Patient)
  async patient(@Parent() appointment: Appointment): Promise<Patient> {
    return await this.userService.getPatientByAppointment(appointment.id);
  }
}
