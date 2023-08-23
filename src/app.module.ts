import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { MessagesWsModule } from './messages-ws/messages-ws.module';
import { ConexionDB } from './config/app.config';
import { RepositoriosModule } from './repositorios/repositorios.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UsuariosModule } from './usuarios/usuarios.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(ConexionDB()),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
    }),
    CommonModule,
    SeedModule,    
    AuthModule, MessagesWsModule, RepositoriosModule, CloudinaryModule, UsuariosModule,    
  ],
  controllers: [],
  providers: [],
  exports:[]
})
export class AppModule {}
