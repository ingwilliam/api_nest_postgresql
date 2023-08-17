import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, Query, ParseUUIDPipe } from '@nestjs/common';
import { RepositoriosService } from './repositorios.service';
import { CreateRepositorioDto } from './dto/create-repositorio.dto';
import { UpdateRepositorioDto } from './dto/update-repositorio.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { CargarArchivos, PathArchivos } from 'src/common/decorators/cargar-archivos-interceptor.decorator';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Usuario } from 'src/usuarios/entities';

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
  @Auth()
  findAll(
    @Query() paginationDto:PaginationDto
  ) {    
    return this.repositoriosService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id', ParseUUIDPipe) id:string) {
    return this.repositoriosService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id', ParseUUIDPipe) id: string, @Body() updateRepositorioDto: UpdateRepositorioDto
    ) {      
    return this.repositoriosService.update(id, updateRepositorioDto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.repositoriosService.remove(id);
  }
}
