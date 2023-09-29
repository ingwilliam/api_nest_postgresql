import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu, MenuRol, Rol, Usuario, UsuarioRol } from './entities';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
  imports:[    
      TypeOrmModule.forFeature([Usuario,UsuarioRol,Rol,Menu,MenuRol]),
      ConfigModule,
      PassportModule.register({defaultStrategy:'jwt'}),
    ],
  exports: [UsuariosService],
})
export class UsuariosModule {}
