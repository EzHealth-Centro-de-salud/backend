import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient, Personnel } from './entities/user.entity';
import { PatientResolver, PersonnelResolver } from './user.resolver';
import { UserService } from './user.service';
import { BranchModule } from 'src/branch/branch.module';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Personnel]), BranchModule],
  providers: [UserService, PatientResolver, PersonnelResolver],
  exports: [UserService],
})
export class UserModule {}
