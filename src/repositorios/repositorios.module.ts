import { Module } from '@nestjs/common';
import { RepositoriosService } from './repositorios.service';
import { RepositoriosController } from './repositorios.controller';
import { Repositorio } from './entities/repositorio.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [RepositoriosController],
  providers: [RepositoriosService],
  imports:[ 
    TypeOrmModule.forFeature([Repositorio]),
    AuthModule
  ],
})
export class RepositoriosModule {}
