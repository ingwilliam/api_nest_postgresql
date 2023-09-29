import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Rol, Usuario,UsuarioRol, } from '../usuarios/entities';
import { JwtStrategy , GoogleStrategy , FacebookStrategy } from './strategies/';
import { RepositoriosModule } from 'src/repositorios/repositorios.module';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy
  ],
  imports:[ 
    ConfigModule,
    TypeOrmModule.forFeature([Usuario,UsuarioRol,Rol]),
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: (configService: ConfigService) => {            
        return {
            secret:configService.get('JWT_SECRET'),
            signOptions:{
              expiresIn:'2d'
            }
          }
      }
    }),
    RepositoriosModule    
  ],
  exports:[
    TypeOrmModule,
    JwtStrategy,
    GoogleStrategy,
    PassportModule,
    JwtModule
  ]

})
export class AuthModule {}
