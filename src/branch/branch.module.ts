import { Module, forwardRef } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BoxResolver, BranchResolver } from './branch.resolver';
import { Branch } from './entities/branch.entity';
import { Box } from './entities/box.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Branch, Box]),
    forwardRef(() => UserModule),
  ],
  providers: [BranchResolver, BoxResolver, BranchService],
  exports: [BranchService],
})
export class BranchModule {}
