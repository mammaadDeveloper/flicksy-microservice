import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class RegistryService {
    constructor(
        @InjectRepository(Service)
        private readonly serviceRepo: Repository<Service>
    ){}
    async create(createServiceDto: CreateServiceDto){
        const newService = this.serviceRepo.create(createServiceDto);
        return await this.serviceRepo.save(newService);
    }

    async getServices(){
        return await this.serviceRepo.find();
    }

    async findByName(name: string){
        return await this.serviceRepo.findOneBy({name});
    }

    async findByPrefix(prefix: string){
        return await this.serviceRepo.findOneBy({prefix});
    }
}
