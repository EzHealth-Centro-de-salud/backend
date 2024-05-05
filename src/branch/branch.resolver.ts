import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BranchService } from './branch.service';
import { Branch, BranchResponse } from './entities/branch.entity';
import { CreateBranchInput } from './dto/create-branch.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/middleware/jwt.auth.guard';
import { Roles, RolesGuard } from 'src/auth/decorators/role.guard';
import { Box } from './entities/box.entity';
import { CreateBoxInput } from './dto/create-box.input';

@Resolver()
export class BranchResolver {
  constructor(private readonly branchService: BranchService) {}

  //------------------------------------Branch------------------------------------
  @UseGuards(GqlAuthGuard)
  @Query((returns) => Branch)
  async getBranch(@Args('id', { type: () => Int }) id: number) {
    return await this.branchService.getBranch(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query((returns) => [Branch])
  async getBranches() {
    return await this.branchService.getAllBranch();
  }

  @Roles('personnel')
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Mutation(() => BranchResponse)
  async createBranch(@Args('input') createBranchInput: CreateBranchInput) {
    try {
      return await this.branchService.createBranch(createBranchInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //------------------------------------Box------------------------------------
  @UseGuards(GqlAuthGuard)
  @Query((returns) => Box)
  async getBox(@Args('id', { type: () => Int }) id: number) {
    return await this.branchService.getBox(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query((returns) => [Box])
  async getBoxesByBranch(
    @Args('id_branch', { type: () => Int }) id_branch: number,
  ) {
    return await this.branchService.getBoxesByBranch(id_branch);
  }

  @Roles('personnel')
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Mutation(() => BranchResponse)
  async createBox(@Args('input') createBoxInput: CreateBoxInput) {
    try {
      return await this.branchService.createBox(createBoxInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
