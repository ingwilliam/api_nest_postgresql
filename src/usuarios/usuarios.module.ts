import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol, Usuario, UsuarioRol } from './entities';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
  imports:[    
      TypeOrmModule.forFeature([Usuario,UsuarioRol,Rol]),
    ]
})
export class UsuariosModule {}
