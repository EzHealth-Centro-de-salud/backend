import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient, Personnel } from './entities/user.entity';
import {
  AvailabilityResolver,
  PatientResolver,
  PersonnelResolver,
} from './user.resolver';
import { UserService } from './user.service';
import { BranchModule } from 'src/branch/branch.module';
import { Availability } from './entities/availability.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient, Personnel, Availability, Appointment]),
    BranchModule,
  ],
  providers: [
    UserService,
    PatientResolver,
    PersonnelResolver,
    AvailabilityResolver,
  ],
  exports: [UserService],
})
export class UserModule {}
