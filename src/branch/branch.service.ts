import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBranchInput } from './dto/create-branch.input';
import { Branch, BranchResponse } from './entities/branch.entity';
import { Box, BoxResponse } from './entities/box.entity';
import { CreateBoxInput } from './dto/create-box.input';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    @InjectRepository(Box)
    private boxRepository: Repository<Box>,
  ) {}

  //------------------------------------Branch Methods------------------------------------
  async getBranch(id: number): Promise<Branch> {
    return this.branchRepository.findOne({ where: { id } });
  }

  async getAllBranch(): Promise<Branch[]> {
    return this.branchRepository.find();
  }

  async createBranch(input: CreateBranchInput): Promise<BranchResponse> {
    const branch = await this.branchRepository.findOne({
      where: { address: input.address },
    });

    if (branch) {
      throw new Error('Sucursal ya registrada.');
    }

    const newBranch = this.branchRepository.create({
      ...input,
      box_count: 0,
    });

    await this.branchRepository.save(newBranch);

    const success = true;
    const message = 'Sucursal creada exitosamente.';
    const response = { success, message };

    return response;
  }

  //------------------------------------Box Methods------------------------------------
  async getBox(id: number): Promise<Box> {
    return this.boxRepository.findOne({ where: { id } });
  }

  async getBoxesByBranch(id_branch: number): Promise<Box[]> {
    return this.boxRepository.find({ where: { branch: { id: id_branch } } });
  }

  async createBox(input: CreateBoxInput): Promise<BoxResponse> {
    const box = await this.boxRepository.findOne({
      where: {
        box: input.box,
        branch: { id: input.id_branch },
      },
    });

    if (box) {
      throw new Error('Box ya registrado.');
    }

    const newBox = this.boxRepository.create({
      ...input,
    });

    await this.boxRepository.save(newBox);

    const success = true;
    const message = 'Box creado exitosamente.';
    const response = { success, message };

    return response;
  }
}
