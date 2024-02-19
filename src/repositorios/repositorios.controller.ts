import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, Query, ParseUUIDPipe, Res, BadRequestException, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RepositoriosService } from './repositorios.service';
import { CreateRepositorioDto } from './dto/create-repositorio.dto';
import { UpdateRepositorioDto } from './dto/update-repositorio.dto';
import { Auth, GetUsuario } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { CargarArchivos, PathArchivos } from '../common/decorators/cargar-archivos-interceptor.decorator';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Usuario } from '../usuarios/entities';
import { Response } from 'express';
import { MinioService } from '../minio/minio.service';

import { FilesInterceptor } from '@nestjs/platform-express';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import * as request from 'request';


@ApiTags('Repositorios')
@Controller('repositorios')
export class RepositoriosController {

  constructor(
    private readonly repositoriosService: RepositoriosService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly minioService: MinioService,
    private readonly http: AxiosAdapter,
  ) { }



  
  @Get('view/:imageName')
  async imageMinio(
    @Res() res:Response,
    @Param('imageName') url:string
  ){
    const externalUrl=await this.minioService.getPublicUrl(url);
    
    res.header('Content-Type', 'application/octet-stream');
    res.header('Content-Disposition', `inline; filename="${url}"`);

    // Realiza una solicitud HTTP para obtener el archivo desde la URL externa y transmite directamente al cliente
    request.get(externalUrl).pipe(res);

  }

  @Get('viewFolder/:imageName')
  imageFolder(
    @Res() res:Response,
    @Param('imageName') imageName:string
  ){
    const path=this.repositoriosService.getStaticProductImage(imageName);

    res.sendFile(path);
  }  

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
      throw new BadRequestException(`El registro no cuenta con archivos para cargar`);
    }
  }

  @Post('/minio')
  @Auth(ValidRoles.admin)
  @CargarArchivos('files', 10, 15)
  async createMinio(
    @Body() createRepositorioDto: CreateRepositorioDto,
    @UploadedFiles() files: Express.Multer.File[],
    @GetUsuario() usuario: Usuario,  
  ) {
    const urls = await this.minioService.upload(files);

    console.log({urls});
    
    console.log({usuario:usuario.email,context:RepositoriosController.name,"description":"Ingresa a crear el registro"});            
    if(urls.length>0)
    {
      return this.repositoriosService.create(createRepositorioDto, usuario, urls);
    }
    else
    {
      throw new BadRequestException(`El registro no cuenta con archivos para cargar`);
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



  // @Post('/minio')
  // @Auth(ValidRoles.admin)
  // @CargarArchivos('files', 10, 15)
  // async createMinio(
  //   @Body() createRepositorioDto: CreateRepositorioDto,
  //   @UploadedFiles() files: Express.Multer.File[],
  //   @GetUsuario() usuario: Usuario,    
  // ) {
  //   return this.minioService.uploadFile(files)     
  // }

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
