import { Injectable } from '@nestjs/common';
import { CreateBranchInput } from './dto/create-branch.input';
import { UpdateBranchInput } from './dto/update-branch.input';

@Injectable()
export class BranchService {
  create(createBranchInput: CreateBranchInput) {
    return 'This action adds a new branch';
  }

  findAll() {
    return `This action returns all branch`;
  }

  findOne(id: number) {
    return `This action returns a #${id} branch`;
  }

  update(id: number, updateBranchInput: UpdateBranchInput) {
    return `This action updates a #${id} branch`;
  }

  remove(id: number) {
    return `This action removes a #${id} branch`;
  }
}
