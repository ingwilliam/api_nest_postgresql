import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { CommonModule } from './common/common.module';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { MessagesWsModule } from './messages-ws/messages-ws.module';
import { ConexionDB } from './config/app.config';
import { RepositoriosModule } from './repositorios/repositorios.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { MinioModule } from './minio/minio.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(ConexionDB()),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    CommonModule,
    AuthModule, 
    MessagesWsModule, 
    RepositoriosModule, 
    CloudinaryModule, 
    UsuariosModule, MinioModule,
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule { }
