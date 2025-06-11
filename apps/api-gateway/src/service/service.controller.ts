import { Body, Controller, Get, Post } from '@nestjs/common';
import { Service } from './service.service';
import { CreateServiceDto } from './dto/service.dto';

@Controller('services')
export class ServiceController {
  constructor(private readonly service: Service) {}
  @Get()
  async getAll(){
    return await this.service.findAll();
  }
  @Post()
  async create(@Body() body: CreateServiceDto) {
    return await this.service.createService(body.name, body.url, body.protect);
  }
}
