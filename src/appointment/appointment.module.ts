import { Module, forwardRef } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentResolver } from './appointment.resolver';
import { Appointment } from './entities/appointment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { BranchModule } from 'src/branch/branch.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    forwardRef(() => UserModule),
    forwardRef(() => BranchModule),
  ],
  providers: [AppointmentResolver, AppointmentService],
})
export class AppointmentModule {}
