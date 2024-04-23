import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserResponse, Patient, Personnel } from './entities/user.entity';
import {
  CreatePatientInput,
  CreatePersonnelInput,
} from './dto/create-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/middleware/jwt.auth.guard';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Query((returns) => Patient)
  async getPatient(@Args('rut') rut: string) {
    const patient = await this.userService.getPatientByRut(rut);

    if (!patient) {
      throw new Error('Paciente no encontrado.');
    }
    return patient;
  }

  @Mutation(() => UserResponse)
  async createPatient(@Args('patientInput') patientInput: CreatePatientInput) {
    try {
      return await this.userService.createPatient(patientInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @UseGuards(GqlAuthGuard)
  @Query((returns) => Personnel)
  async getPersonnel(@Args('rut') rut: string) {
    const personnel = await this.userService.getPersonnelByRut(rut);

    if (!personnel) {
      throw new Error('Personal no encontrado.');
    }
    return personnel;
  }

  @Mutation(() => UserResponse)
  async createPersonnel(
    @Args('personnelInput') personnelInput: CreatePersonnelInput,
  ) {
    try {
      return await this.userService.createPersonnel(personnelInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
