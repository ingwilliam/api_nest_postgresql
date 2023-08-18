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
    return this.usuariosService.create(createUsuarioDto,usuario);
  }

  @Get()
  @Auth()
  findAll(
    @Query() paginationDto:PaginationDto
  ) {    
    return this.usuariosService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id', ParseUUIDPipe) id:string) {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.usuariosService.remove(id);
  }
}
