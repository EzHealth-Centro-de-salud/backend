import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchResolver } from './branch.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { Box } from './entities/box.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Branch, Box])],
  providers: [BranchResolver, BranchService],
  exports: [BranchService],
})
export class BranchModule {}
