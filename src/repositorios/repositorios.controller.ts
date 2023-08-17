import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles } from '@nestjs/common';
import { RepositoriosService } from './repositorios.service';
import { CreateRepositorioDto } from './dto/create-repositorio.dto';
import { UpdateRepositorioDto } from './dto/update-repositorio.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { CargarArchivos, PathArchivos } from 'src/common/decorators/cargar-archivos-interceptor.decorator';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Usuario } from 'src/auth/entities';

@Controller('repositorios')
export class RepositoriosController {

  constructor(
    private readonly repositoriosService: RepositoriosService,
    private readonly cloudinaryService: CloudinaryService
  ) { }

  @Post()
  @Auth(ValidRoles.admin)
  @CargarArchivos('files', 10, 15, './static/repositorios')
  create(
    @Body() createRepositorioDto: CreateRepositorioDto,
    @UploadedFiles() files,
    @GetUser() usuario: Usuario,
    @PathArchivos() urls
  ) {
    return this.repositoriosService.create(createRepositorioDto, usuario, urls);
  }

  @Post('/cloudinary')
  @Auth(ValidRoles.admin)
  @CargarArchivos('files', 10, 15)
  async createCloudinary(
    @Body() createRepositorioDto: CreateRepositorioDto,
    @UploadedFiles() files,
    @GetUser() usuario: Usuario,    
  ) {
    const urls = await this.cloudinaryService.upload(files);
    return this.repositoriosService.create(createRepositorioDto, usuario, urls);
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
