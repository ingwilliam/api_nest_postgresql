import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Auth, GetUsuario } from 'src/auth/decorators';
import { Usuario } from './entities';
import { ValidRoles } from 'src/auth/interfaces';
import { PaginationDto } from 'src/common/dto/pagination.dto';


@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @ApiResponse({status:201,description:'Producto creado',type:Usuario})
  @ApiResponse({status:400,description:'Bad request'})
  @ApiResponse({status:401,description:'Unauthorized'})
  @ApiResponse({status:500,description:'Internal Server Error'})
  @ApiBearerAuth('JWT-auth')
  @Auth()
  findAll(
    @Query() paginationDto:PaginationDto,
    @GetUsuario() usuario:Usuario
  ) {
    console.log({usuario:usuario.email,context:UsuariosController.name,"description":"Ingresa a consultar todos los registros"});            
    return this.usuariosService.findAll(paginationDto,usuario);
  }

  @Get('/roles')
  @ApiBearerAuth('JWT-auth')
  @Auth()
  findRoles(
    @Query() paginationDto:PaginationDto,
    @GetUsuario() usuario:Usuario
  ) {
    console.log({usuario:usuario.email,context:UsuariosController.name,"description":"Ingresa a consultar todos los roles"});            
    return this.usuariosService.findRoles(usuario);
  }


  @Get(':id')
  @ApiResponse({status:201,description:'Producto creado',type:Usuario})
  @ApiResponse({status:400,description:'Bad request'})
  @ApiResponse({status:401,description:'Unauthorized'})
  @ApiResponse({status:500,description:'Internal Server Error'})
  @ApiBearerAuth('JWT-auth')
  @Auth()
  findOne(
    @Param('id', ParseUUIDPipe) id:string,
    @GetUsuario() usuario:Usuario
    ) {
    console.log({usuario:usuario.email,context:UsuariosController.name,"description":"Ingresa a consultar el registro"});            
    return this.usuariosService.findOne(id,usuario);
  }

  @Post()
  @ApiResponse({status:201,description:'Producto creado',type:Usuario})
  @ApiResponse({status:400,description:'Bad request'})
  @ApiResponse({status:401,description:'Unauthorized'})
  @ApiResponse({status:500,description:'Internal Server Error'})
  @ApiBearerAuth('JWT-auth')
  @Auth(ValidRoles.admin)
  create(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @GetUsuario() usuario: Usuario,
    ) {
    console.log({usuario:usuario.email,context:UsuariosController.name,"description":"Ingresa a crear el registro"});            
    return this.usuariosService.create(createUsuarioDto,usuario);
  }

  @Patch(':id')
  @ApiResponse({status:201,description:'Producto creado',type:Usuario})
  @ApiResponse({status:400,description:'Bad request'})
  @ApiResponse({status:401,description:'Unauthorized'})
  @ApiResponse({status:500,description:'Internal Server Error'})
  @ApiBearerAuth('JWT-auth')
  @Auth(ValidRoles.admin)
  update(
    @Param('id',ParseUUIDPipe) id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @GetUsuario() usuario:Usuario
    ) {
    console.log({usuario:usuario.email,context:UsuariosController.name,"description":"Ingresa a actualizar el registro"});            
    return this.usuariosService.update(id, updateUsuarioDto, usuario);
  }

  @Delete(':id')
  @ApiResponse({status:201,description:'Producto creado',type:Usuario})
  @ApiResponse({status:400,description:'Bad request'})
  @ApiResponse({status:401,description:'Unauthorized'})
  @ApiResponse({status:500,description:'Internal Server Error'})
  @ApiBearerAuth('JWT-auth')
  @Auth(ValidRoles.admin)
  remove(
    @Param('id',ParseUUIDPipe) id: string,
    @GetUsuario() usuario:Usuario
    ) {
    console.log({usuario:usuario.email,context:UsuariosController.name,"description":"Ingresa a eliminar el registro"});            
    return this.usuariosService.remove(id,usuario);
  }
}
