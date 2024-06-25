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
import { ConfirmAppointmentInput } from './dto/confirm-appointment.input';
import { CompleteAppointmentInput } from './dto/complete-appointment.input';
import { CancelAppointmentInput } from './dto/cancel-appointment.input';
import { RescheduleAppointmentInput } from './dto/reschedule-appointment.input';

@Resolver(() => Appointment)
export class AppointmentResolver {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly branchService: BranchService,
  ) {}

  @Query(() => Appointment)
  async getAppointment(@Args('id', { type: () => Int }) id: number) {
    return await this.appointmentService.getAppointment(id);
  }

  @Query(() => [Appointment])
  async getAllAppointments() {
    return await this.appointmentService.getAllAppointments();
  }

  @Mutation(() => AppointmentResponse)
  async createAppointment(
    @Args('input') createAppointmentInput: CreateAppointmentInput,
  ) {
    try {
      return await this.appointmentService.createAppointment(
        createAppointmentInput,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Mutation(() => AppointmentResponse)
  async confirmAppointment(
    @Args('input') confirmAppointmentInput: ConfirmAppointmentInput,
  ) {
    try {
      return await this.appointmentService.confirmAppointment(
        confirmAppointmentInput,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Mutation(() => AppointmentResponse)
  async completeAppointment(
    @Args('input') completeAppointmentInput: CompleteAppointmentInput,
  ) {
    try {
      return await this.appointmentService.completeAppointment(
        completeAppointmentInput,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Mutation(() => AppointmentResponse)
  async cancelAppointment(
    @Args('input') cancelAppointmentInput: CancelAppointmentInput,
  ) {
    try {
      return await this.appointmentService.cancelAppointment(
        cancelAppointmentInput,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Mutation(() => AppointmentResponse)
  async rescheduleAppointment(
    @Args('input') rescheduleAppointmentInput: RescheduleAppointmentInput,
  ) {
    try {
      return await this.appointmentService.rescheduleAppointment(
        rescheduleAppointmentInput,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @ResolveField(() => Box)
  async box(@Parent() appointment: Appointment): Promise<Box> {
    return await this.branchService.getBoxByAppointment(appointment.id);
  }
}
