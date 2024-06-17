import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserResponse, Patient, Personnel } from './entities/user.entity';
import {
  CreatePatientInput,
  CreatePersonnelInput,
} from './dto/create-user.input';
import { Res, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/middleware/jwt.auth.guard';
import { Roles, RolesGuard } from 'src/auth/decorators/role.guard';
import { Branch } from 'src/branch/entities/branch.entity';
import { BranchService } from 'src/branch/branch.service';
import {
  Availability,
  AvailabilityResponse,
} from './entities/availability.entity';
import { AssignAvailabilityInput } from './dto/assign-availability.input';
import { CheckScheduleInput } from './dto/check-schedule.input';
import { Appointment } from 'src/appointment/entities/appointment.entity';

//------------------------------------Patient Methods------------------------------------
@Resolver(() => Patient)
export class PatientResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserResponse)
  async uniqueRUT(@Args('rut') rut: string) {
    try {
      console.log('-> uniqueRUT');
      return await this.userService.uniqueRUT(rut);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //@UseGuards(GqlAuthGuard, RolesGuard)
  @Query(() => Patient)
  async getPatientByRut(@Args('rut') rut: string) {
    console.log('-> getPatientByRut');
    const patient = await this.userService.getPatientByRut(rut);

    if (!patient) {
      throw new Error('Paciente no encontrado');
    }
    return patient;
  }

  //@UseGuards(GqlAuthGuard, RolesGuard)
  @Query(() => Patient)
  async getPatient(@Args('id', { type: () => Int }) id: number) {
    console.log('-> getPatient');
    const patient = await this.userService.getPatient(id);

    if (!patient) {
      throw new Error('Paciente no encontrado');
    }
    return patient;
  }

  //@Roles('personnel')
  //@UseGuards(GqlAuthGuard, RolesGuard)
  @Query(() => [Patient])
  async getAllPatients() {
    console.log('-> getAllPatients');
    return await this.userService.getAllPatients();
  }

  @Mutation(() => UserResponse)
  async createPatient(@Args('input') patientInput: CreatePatientInput) {
    try {
      console.log('-> createPatient');
      return await this.userService.createPatient(patientInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // @ResolveField(() => [Appointment])
  // async appointments(@Parent() patient: Patient): Promise<Appointment[]> {
  //   return this.userService.getAppointmentsByPatient(patient.id);
  // }
}

//------------------------------------Personnel Methods------------------------------------
@Resolver(() => Personnel)
export class PersonnelResolver {
  constructor(
    private readonly userService: UserService,
    private readonly branchService: BranchService,
  ) {}

  //@UseGuards(GqlAuthGuard)
  @Query(() => Personnel)
  async getPersonnelByRut(@Args('rut') rut: string) {
    console.log('-> getPersonnelByRut');
    const personnel = await this.userService.getPersonnelByRut(rut);

    if (!personnel) {
      throw new Error('Personal no encontrado');
    }
    return personnel;
  }

  //@UseGuards(GqlAuthGuard)
  @Query(() => Personnel)
  async getPersonnel(@Args('id', { type: () => Int }) id: number) {
    console.log('-> getPersonnel');
    const personnel = await this.userService.getPersonnel(id);

    if (!personnel) {
      throw new Error('Personal no encontrado');
    }
    return personnel;
  }

  //@UseGuards(GqlAuthGuard)
  @Query(() => [Personnel])
  async getAllPersonnel() {
    console.log('-> getAllPersonnel');
    return await this.userService.getAllPersonnel();
  }

  //@Roles('personnel')
  //@UseGuards(GqlAuthGuard)
  @Mutation(() => UserResponse)
  async createPersonnel(@Args('input') personnelInput: CreatePersonnelInput) {
    try {
      console.log('-> createPersonnel');
      return await this.userService.createPersonnel(personnelInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @ResolveField(() => Branch)
  async branch(@Parent() personnel: Personnel): Promise<Branch> {
    return this.branchService.getBranchByUser(personnel.id);
  }

  @ResolveField(() => [Availability])
  async availability(@Parent() personnel: Personnel): Promise<Availability[]> {
    return this.userService.getAvailabilityByPersonnel(personnel.id);
  }

  // @ResolveField(() => [Appointment])
  // async appointments(@Parent() personnel: Personnel): Promise<Appointment[]> {
  //   return this.userService.getAppointmentsByPersonnel(personnel.id);
  // }
}

//------------------------------------Availability Methods------------------------------------
@Resolver(() => Availability)
export class AvailabilityResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => AvailabilityResponse)
  async checkSchedule(@Args('input') scheduleInput: CheckScheduleInput) {
    try {
      console.log('-> checkSchedule');
      return await this.userService.checkSchedule(scheduleInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Query(() => [Availability])
  async getAvailabilityByPersonnel(
    @Args('id_personnel', { type: () => Int }) id_personnel: number,
  ) {
    try {
      console.log('-> getAvailabilityByPersonnel');
      return await this.userService.getAvailabilityByPersonnel(id_personnel);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Mutation(() => AvailabilityResponse)
  async assignAvailability(
    @Args('input') availabilityInput: AssignAvailabilityInput,
  ) {
    try {
      console.log('-> assignAvailability');
      return await this.userService.assignAvailability(availabilityInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
