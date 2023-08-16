import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Rol, Usuario,UsuarioRol, } from './entities';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
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
              expiresIn:'2h'
            }
          }
      }
    }),    
  ],
  exports:[TypeOrmModule,JwtStrategy, PassportModule,JwtModule]

})
export class AuthModule {}
