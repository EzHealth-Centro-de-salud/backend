import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { Patient, Personnel } from './entities/user.entity';
import { CreatePatientInput, CreatePersonnelInput } from './dto/create-user.input';

@Resolver(() => Patient)
export class PatientResolver {
  constructor(private readonly userService: UserService) { }

  @Query((returns) => Patient)
  async getPatient(@Args('rut') rut: string) {
    const patient = await this.userService.getPatientByRut(rut);

    if (!patient) {
      throw new Error('Paciente no encontrado.');
    }
    return patient;
  }

  @Mutation(() => Patient)
  async createPatient(@Args('patientInput') patientInput: CreatePatientInput) {
    try {
      const newPatient = await this.userService.createPatient(patientInput);
      return newPatient;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

@Resolver(() => Personnel)
export class PersonnelResolver {
  constructor(private readonly userService: UserService) { }

  @Query((returns) => Personnel)
  async getPersonnel(@Args('rut') rut: string) {
    const personnel = await this.userService.getPersonnelByRut(rut);

    if (!personnel) {
      throw new Error('Personal no encontrado.');
    }
    return personnel;
  }

  @Mutation(() => Personnel)
  async createPersonnel(@Args('personnelInput') personnelInput: CreatePersonnelInput) {
    try {
      const newPersonnel = await this.userService.createPersonnel(personnelInput);
      return newPersonnel;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}