import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient, Personnel } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { BranchModule } from 'src/branch/branch.module';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Personnel]), BranchModule],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
