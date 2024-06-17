import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Equal } from 'typeorm';
import { CreateBranchInput } from './dto/create-branch.input';
import { Branch, BranchResponse } from './entities/branch.entity';
import { Box, BoxResponse } from './entities/box.entity';
import { CreateBoxInput } from './dto/create-box.input';
import { UpdateBoxInput } from './dto/update-box.input';
import { UpdateBranchInput } from './dto/update-branch.input';

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
    return this.branchRepository.findOne({
      where: { id },
      relations: ['boxes'],
    });
  }

  async getAllBranch(): Promise<Branch[]> {
    return this.branchRepository.find();
  }

  async getBranchByUser(id_user: number): Promise<Branch> {
    return this.branchRepository.findOne({
      where: { personnel: { id: id_user } },
      relations: ['boxes'],
    });
  }

  async getBranchByBox(id_box: number): Promise<Branch> {
    return this.branchRepository.findOne({
      where: { boxes: { id: id_box } },
    });
  }

  async createBranch(input: CreateBranchInput): Promise<BranchResponse> {
    const branch = await this.branchRepository.findOne({
      where: { address: input.address },
    });

    if (branch) {
      throw new Error('Sucursal ya registrada');
    }

    const newBranch = this.branchRepository.create({
      ...input,
      box_count: 4,
      is_active: true,
    });

    await this.branchRepository.save(newBranch);

    for (let i = 1; i < 5; i++) {
      const newBox = this.boxRepository.create({
        box: i,
        is_active: true,
        branch: newBranch,
      });

      await this.boxRepository.save(newBox);
    }

    const success = true;
    const message = 'Sucursal creada exitosamente';
    const response = { success, message };

    return response;
  }

  async updateBranch(input: UpdateBranchInput): Promise<Branch> {
    const branch = await this.branchRepository.findOne({
      where: { id: input.id },
    });

    if (!branch) {
      throw new Error('Sucursal no encontrada');
    }

    if (input.address) {
      const foundBranch = await this.branchRepository.findOne({
        where: {
          address: input.address,
          id: Not(Equal(input.id)),
        },
      });

      if (foundBranch) {
        throw new Error('Sucursal ya registrada');
      } else {
        branch.address = input.address;
      }
    }

    if (input.is_active !== undefined) {
      branch.is_active = input.is_active;
    }

    await this.branchRepository.save(branch);

    return branch;
  }

  //------------------------------------Box Methods------------------------------------
  async getBox(id: number): Promise<Box> {
    return this.boxRepository.findOne({ where: { id } });
  }

  async getBoxesByBranch(id_branch: number): Promise<Box[]> {
    return this.boxRepository.find({ where: { branch: { id: id_branch } } });
  }

  async getBoxByAppointment(id_appointment: number): Promise<Box> {
    return this.boxRepository.findOne({
      where: { appointments: { id: id_appointment } },
    });
  }

  async createBox(input: CreateBoxInput): Promise<BoxResponse> {
    const box = await this.boxRepository.findOne({
      where: {
        box: input.box,
        branch: { id: input.id_branch },
      },
    });

    if (box) {
      throw new Error('Box ya registrado');
    }

    const branch = await this.branchRepository.findOne({
      where: { id: input.id_branch },
    });

    const newBox = this.boxRepository.create({
      ...input,
      is_active: true,
      branch,
    });

    branch.box_count += 1;

    await this.boxRepository.save(newBox);
    await this.branchRepository.save(branch);

    const success = true;
    const message = 'Box creado exitosamente';
    const response = { success, message };

    return response;
  }

  async updateBox(input: UpdateBoxInput): Promise<Box> {
    console.log(input);
    const box = await this.boxRepository.findOne({
      where: { id: input.id },
    });

    if (!box) {
      throw new Error('Box no encontrado.');
    }

    if (input.box) {
      const foundBox = await this.boxRepository.findOne({
        where: {
          box: input.box,
          id: Not(Equal(input.id)),
          branch: { id: box.branch.id },
        },
      });

      if (foundBox) {
        throw new Error('Box ya registrado en la sucursal');
      } else {
        box.box = input.box;
      }
    }

    if (input.is_active !== undefined) {
      box.is_active = input.is_active;
    }

    await this.boxRepository.save(box);

    return box;
  }
}
