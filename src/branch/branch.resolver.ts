import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BranchService } from './branch.service';
import { Branch } from './entities/branch.entity';
import { CreateBranchInput } from './dto/create-branch.input';
import { UpdateBranchInput } from './dto/update-branch.input';

@Resolver(() => Branch)
export class BranchResolver {
  constructor(private readonly branchService: BranchService) {}

  @Mutation(() => Branch)
  createBranch(@Args('createBranchInput') createBranchInput: CreateBranchInput) {
    return this.branchService.create(createBranchInput);
  }

  @Query(() => [Branch], { name: 'branch' })
  findAll() {
    return this.branchService.findAll();
  }

  @Query(() => Branch, { name: 'branch' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.branchService.findOne(id);
  }

  @Mutation(() => Branch)
  updateBranch(@Args('updateBranchInput') updateBranchInput: UpdateBranchInput) {
    return this.branchService.update(updateBranchInput.id, updateBranchInput);
  }

  @Mutation(() => Branch)
  removeBranch(@Args('id', { type: () => Int }) id: number) {
    return this.branchService.remove(id);
  }
}
