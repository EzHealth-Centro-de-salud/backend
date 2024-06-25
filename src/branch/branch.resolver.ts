import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { BranchService } from './branch.service';
import { Branch, BranchResponse } from './entities/branch.entity';
import { CreateBranchInput } from './dto/create-branch.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/middleware/jwt.auth.guard';
import { Roles, RolesGuard } from 'src/auth/decorators/role.guard';
import { Box } from './entities/box.entity';
import { CreateBoxInput } from './dto/create-box.input';
import { UserService } from 'src/user/user.service';
import { Personnel } from 'src/user/entities/user.entity';
import { UpdateBoxInput } from './dto/update-box.input';
import { UpdateBranchInput } from './dto/update-branch.input';

@Resolver(() => Branch)
export class BranchResolver {
  constructor(
    private readonly branchService: BranchService,
    private readonly userService: UserService,
  ) {}

  //------------------------------------Branch------------------------------------
  //@UseGuards(GqlAuthGuard)
  @Query((returns) => Branch)
  async getBranch(@Args('id', { type: () => Int }) id: number) {
    return await this.branchService.getBranch(id);
  }

  //@UseGuards(GqlAuthGuard)
  @Query((returns) => [Branch])
  async getAllBranches() {
    return await this.branchService.getAllBranch();
  }

  //@Roles('personnel')
  //@UseGuards(GqlAuthGuard, RolesGuard)
  //@UseGuards(GqlAuthGuard)
  @Mutation(() => BranchResponse)
  async createBranch(@Args('input') createBranchInput: CreateBranchInput) {
    try {
      return await this.branchService.createBranch(createBranchInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Mutation(() => Branch)
  async updateBranch(@Args('input') updateBranchInput: UpdateBranchInput) {
    try {
      return await this.branchService.updateBranch(updateBranchInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @ResolveField((returns) => [Box])
  async boxes(@Parent() branch: Branch): Promise<Box[]> {
    return await this.branchService.getBoxesByBranch(branch.id);
  }

  @ResolveField((returns) => [Personnel])
  async personnel(@Parent() branch: Branch): Promise<Personnel[]> {
    return await this.userService.getPersonnelByBranch(branch.id);
  }
}

//------------------------------------Box------------------------------------
@Resolver(() => Box)
export class BoxResolver {
  constructor(private readonly branchService: BranchService) {}
  //@UseGuards(GqlAuthGuard)
  @Query((returns) => Box)
  async getBox(@Args('id', { type: () => Int }) id: number) {
    return await this.branchService.getBox(id);
  }

  //@UseGuards(GqlAuthGuard)
  @Query((returns) => [Box])
  async getBoxesByBranch(
    @Args('id_branch', { type: () => Int }) id_branch: number,
  ) {
    return await this.branchService.getBoxesByBranch(id_branch);
  }

  //@Roles('personnel')
  //@UseGuards(GqlAuthGuard, RolesGuard)
  //@UseGuards(GqlAuthGuard)
  @Mutation(() => BranchResponse)
  async createBox(@Args('input') createBoxInput: CreateBoxInput) {
    try {
      return await this.branchService.createBox(createBoxInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Mutation(() => Box)
  async updateBox(@Args('input') updateBoxInput: UpdateBoxInput) {
    try {
      return await this.branchService.updateBox(updateBoxInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @ResolveField((returns) => Branch)
  async branch(@Parent() box: Box): Promise<Branch> {
    return await this.branchService.getBranchByBox(box.id);
  }
}
