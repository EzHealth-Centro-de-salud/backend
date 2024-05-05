import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserResponse, Patient, Personnel } from './entities/user.entity';
import {
  CreatePatientInput,
  CreatePersonnelInput,
} from './dto/create-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/middleware/jwt.auth.guard';
import { Roles, RolesGuard } from 'src/auth/decorators/role.guard';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  //------------------------------------Patient------------------------------------
  @Roles('personnel')
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Query((returns) => Patient)
  async getPatientByRut(@Args('rut') rut: string) {
    const patient = await this.userService.getPatientByRut(rut);

    if (!patient) {
      throw new Error('Paciente no encontrado.');
    }
    return patient;
  }

  @Roles('personnel')
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Query((returns) => Patient)
  async getPatient(@Args('id', { type: () => Int }) id: number) {
    const patient = await this.userService.getPatient(id);

    if (!patient) {
      throw new Error('Paciente no encontrado.');
    }
    return patient;
  }

  @Roles('personnel')
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Query((returns) => [Patient])
  async getAllPatients() {
    return await this.userService.getAllPatients();
  }

  @Mutation(() => UserResponse)
  async createPatient(@Args('input') patientInput: CreatePatientInput) {
    try {
      return await this.userService.createPatient(patientInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //------------------------------------Personnel------------------------------------
  @UseGuards(GqlAuthGuard)
  @Query((returns) => Personnel)
  async getPersonnelByRut(@Args('rut') rut: string) {
    const personnel = await this.userService.getPersonnelByRut(rut);

    if (!personnel) {
      throw new Error('Personal no encontrado.');
    }
    return personnel;
  }

  @UseGuards(GqlAuthGuard)
  @Query((returns) => Personnel)
  async getPersonnel(@Args('id', { type: () => Int }) id: number) {
    const personnel = await this.userService.getPersonnel(id);

    if (!personnel) {
      throw new Error('Personal no encontrado.');
    }
    return personnel;
  }

  @UseGuards(GqlAuthGuard)
  @Query((returns) => [Personnel])
  async getAllPersonnel() {
    return await this.userService.getAllPersonnel();
  }

  @Roles('personnel')
  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserResponse)
  async createPersonnel(@Args('input') personnelInput: CreatePersonnelInput) {
    try {
      return await this.userService.createPersonnel(personnelInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
