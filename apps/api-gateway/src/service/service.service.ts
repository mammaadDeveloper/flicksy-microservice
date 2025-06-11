import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MicroServiceEntity } from './service.entity';
import { Repository } from 'typeorm';

@Injectable()
export class Service {
  constructor(
    @InjectRepository(MicroServiceEntity)
    private readonly repository: Repository<MicroServiceEntity>,
  ) {}

  async findAll(): Promise<MicroServiceEntity[]>{
    return await this.repository.find();
  }

  async findByName(name: string): Promise<MicroServiceEntity | null> {
    return await this.repository.findOne({ where: { name } });
  }
  async createService(name: string, baseUrl: string, isProtected?: boolean) {
    return await this.repository.save(
      this.repository.create({ name, baseUrl, isProtected }),
    );
  }
}
