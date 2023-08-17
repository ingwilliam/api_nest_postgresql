import { Module } from '@nestjs/common';
import { RepositoriosService } from './repositorios.service';

import { Repositorio } from './entities/repositorio.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { RepositoriosController } from './repositorios.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [RepositoriosController],
  providers: [RepositoriosService],
  imports:[ 
    TypeOrmModule.forFeature([Repositorio]),
    AuthModule,
    CloudinaryModule,
    ConfigModule
  ],
})
export class RepositoriosModule {}
