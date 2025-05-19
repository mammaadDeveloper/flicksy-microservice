import { Body, Controller, Get, Post } from '@nestjs/common';
import { RegistryService } from './registry.service';
import { CreateServiceDto } from './dto/create-service.dto';

@Controller('registry')
export class RegistryController {
  constructor(private readonly registryService: RegistryService) {}

  @Get()
  async getServices(){
    return await this.registryService.getServices();
  }

  @Post()
  async createService(@Body() createServiceDto: CreateServiceDto){
    return await this.registryService.create(createServiceDto);
  }
}
