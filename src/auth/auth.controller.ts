import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto , LoginUserDto } from './dto/';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GetUser,Auth,RoleProtected } from './decorators';
import { IncomingHttpHeaders } from 'http';
import { RawHeaders } from '../common/decorators/raw-headers.decorator';
import { ValidRoles } from './interfaces/valid-role';

import { ApiTags } from '@nestjs/swagger';
import { Usuario } from '../usuarios/entities';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  crearUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('ckeck-jwt')
  @Auth()
  ckeckjwt(
    @GetUser() user:Usuario,    
    ) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('validar_params')
  @UseGuards( AuthGuard() )
  validar_params(
    @Req() request: Request,
    @GetUser() user:Usuario,    
    @GetUser('email') userEmail:String,  
    @RawHeaders() rawHeaders:string[], 
    @Headers() headers: IncomingHttpHeaders
  ){
    return {
      user,
      userEmail,
      rawHeaders,
      headers
    }
  }

  @Get('validar_rol')   
  @Auth(ValidRoles.admin)
  validar_rol(
    @GetUser() user:Usuario,    
  ){

    return {      
      user
    }
  }


  
}
