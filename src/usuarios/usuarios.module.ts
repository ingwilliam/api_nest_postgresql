import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol, Usuario, UsuarioRol } from './entities';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
  imports:[    
      TypeOrmModule.forFeature([Usuario,UsuarioRol,Rol]),
      ConfigModule,
      PassportModule.register({defaultStrategy:'jwt'}),
    ]
})
export class UsuariosModule {}
