import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient, Personnel } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Personnel])],
  providers: [UserService, UserResolver],
  exports:[UserService],
})
export class UserModule {}