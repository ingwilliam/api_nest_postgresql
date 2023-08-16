import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RepositoriosService } from './repositorios.service';
import { CreateRepositorioDto } from './dto/create-repositorio.dto';
import { UpdateRepositorioDto } from './dto/update-repositorio.dto';

@Controller('repositorios')
export class RepositoriosController {
  constructor(private readonly repositoriosService: RepositoriosService) {}

  @Post()
  create(@Body() createRepositorioDto: CreateRepositorioDto) {
    return this.repositoriosService.create(createRepositorioDto);
  }

  @Get()
  findAll() {
    return this.repositoriosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repositoriosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRepositorioDto: UpdateRepositorioDto) {
    return this.repositoriosService.update(+id, updateRepositorioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repositoriosService.remove(+id);
  }
}
