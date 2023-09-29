import { Module } from '@nestjs/common';
import { RepositoriosService } from './repositorios.service';
import { RepositoriosController } from './repositorios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repositorio } from './entities/repositorio.entity';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PassportModule } from '@nestjs/passport';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  controllers: [RepositoriosController],
  providers: [RepositoriosService],
  imports:[ 
    TypeOrmModule.forFeature([Repositorio]),
    ConfigModule,
    PassportModule.register({defaultStrategy:'jwt'}),
    CloudinaryModule,
    UsuariosModule    
  ],  
  exports: [RepositoriosService],
})
export class RepositoriosModule {}
