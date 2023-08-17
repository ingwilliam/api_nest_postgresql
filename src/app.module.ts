import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { MessagesWsModule } from './messages-ws/messages-ws.module';
import { EnvConfiguration } from './config/app.config';
import { RepositoriosModule } from './repositorios/repositorios.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UsuariosModule } from './usuarios/usuarios.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ssl: EnvConfiguration().stage==='prod' ? true:false,
      extra:{
        ssl: EnvConfiguration().stage==='prod'
          ? {rejectUnauthorized:false}
          : null
      },
      type:'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities:true,
      synchronize: true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
    }),
    CommonModule,
    SeedModule,    
    AuthModule, MessagesWsModule, RepositoriosModule, CloudinaryModule, UsuariosModule
  ],
  controllers: [],
  providers: [],
  exports:[]
})
export class AppModule {}
