import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, Query, ParseUUIDPipe } from '@nestjs/common';
import { RepositoriosService } from './repositorios.service';
import { CreateRepositorioDto } from './dto/create-repositorio.dto';
import { UpdateRepositorioDto } from './dto/update-repositorio.dto';
import { Auth, GetUsuario } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { CargarArchivos, PathArchivos } from '../common/decorators/cargar-archivos-interceptor.decorator';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Usuario } from '../usuarios/entities';

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
    @GetUsuario() usuario: Usuario,
    @PathArchivos() urls
  ) {
    console.log({usuario:usuario.email,context:RepositoriosController.name,"description":"Ingresa a crear el registro"});            
    if(urls.length>0)
    {
      return this.repositoriosService.create(createRepositorioDto, usuario, urls);
    }
    else
    {
      console.log({usuario:usuario.email,context:RepositoriosController.name,"description":"El registro no cuenta con archivos para cargar"});            
      return;
    }
  }

  @Post('/cloudinary')
  @Auth(ValidRoles.admin)
  @CargarArchivos('files', 10, 15)
  async createCloudinary(
    @Body() createRepositorioDto: CreateRepositorioDto,
    @UploadedFiles() files,
    @GetUsuario() usuario: Usuario,    
  ) {
    const urls = await this.cloudinaryService.upload(files);
    console.log({usuario:usuario.email,context:RepositoriosController.name,"description":"Ingresa a crear el registro"});            
    if(urls.length>0)
    {
      return this.repositoriosService.create(createRepositorioDto, usuario, urls);
    }
    else
    {
      console.log({usuario:usuario.email,context:RepositoriosController.name,"description":"El registro no cuenta con archivos para cargar"});            
      return;
    }    
  }

  @Get()
  @Auth()
  findAll(
    @Query() paginationDto:PaginationDto,
    @GetUsuario() usuario:Usuario
  ) {    
    console.log({usuario:usuario.email,context:RepositoriosController.name,"description":"Ingresa a consultar todos los registros"});            
    return this.repositoriosService.findAll(paginationDto,usuario);
  }

  @Get(':id')
  @Auth()
  findOne(
    @Param('id', ParseUUIDPipe) id:string,
    @GetUsuario() usuario:Usuario
    ) {
    console.log({usuario:usuario.email,context:RepositoriosController.name,"description":"Ingresa a consultar el registro"});            
    return this.repositoriosService.findOne(id,usuario);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRepositorioDto: UpdateRepositorioDto,
    @GetUsuario() usuario:Usuario
    ) {      
    console.log({usuario:usuario.email,context:RepositoriosController.name,"description":"Ingresa a actualizar el registro"});                  
    return this.repositoriosService.update(id, updateRepositorioDto,usuario);
  }

  @Delete(':id')
  @Auth()
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUsuario() usuario:Usuario
    ) {
    console.log({usuario:usuario.email,context:RepositoriosController.name,"description":"Ingresa a eliminar el registro"});            
    return this.repositoriosService.remove(id,usuario);
  }
}
