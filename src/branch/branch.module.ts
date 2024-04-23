import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchResolver } from './branch.resolver';

@Module({
  providers: [BranchResolver, BranchService],
})
export class BranchModule {}
