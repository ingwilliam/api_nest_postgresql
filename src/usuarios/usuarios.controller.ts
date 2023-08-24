import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Auth, GetUsuario } from 'src/auth/decorators';
import { Usuario } from './entities';
import { ValidRoles } from 'src/auth/interfaces';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @GetUsuario() usuario: Usuario,
    ) {
    console.log({usuario:usuario.email,context:UsuariosController.name,"description":"Ingresa a crear el registro"});            
    return this.usuariosService.create(createUsuarioDto,usuario);
  }

  @Get()
  @Auth()
  findAll(
    @Query() paginationDto:PaginationDto,
    @GetUsuario() usuario:Usuario
  ) {
    console.log({usuario:usuario.email,context:UsuariosController.name,"description":"Ingresa a consultar todos los registros"});            
    return this.usuariosService.findAll(paginationDto,usuario);
  }

  @Get(':id')
  @Auth()
  findOne(
    @Param('id', ParseUUIDPipe) id:string,
    @GetUsuario() usuario:Usuario
    ) {
    console.log({usuario:usuario.email,context:UsuariosController.name,"description":"Ingresa a consultar el registro"});            
    return this.usuariosService.findOne(id,usuario);
  }

  @Patch(':id')
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
  @Auth(ValidRoles.admin)
  remove(
    @Param('id',ParseUUIDPipe) id: string,
    @GetUsuario() usuario:Usuario
    ) {
    console.log({usuario:usuario.email,context:UsuariosController.name,"description":"Ingresa a eliminar el registro"});            
    return this.usuariosService.remove(id,usuario);
  }
}
