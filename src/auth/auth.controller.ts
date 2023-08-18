import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistroUsuarioDto , LoginUsuarioDto, RegistroUsuarioGoogleDto } from './dto/';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GetUsuario,Auth,RoleProtected } from './decorators';
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
  register(@Body() createUserDto: RegistroUsuarioDto) {
    return this.authService.create(createUserDto);
  }

  @Post('registerGoogle')
  registerGoogle(@Body() createUserDto: RegistroUsuarioGoogleDto) {
    return this.authService.createGoogle(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUsuarioDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('ckeck-jwt')
  @Auth()
  ckeckjwt(
    @GetUsuario() user:Usuario,    
    ) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('validar_params')
  @UseGuards( AuthGuard() )
  validar_params(
    @Req() request: Request,
    @GetUsuario() user:Usuario,    
    @GetUsuario('email') userEmail:String,  
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
    @GetUsuario() user:Usuario,    
  ){

    return {      
      user
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req) {

    return req.user; // Puedes redirigir o devolver datos del usuario
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookLogin() {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  facebookLoginCallback(@Req() req) {    
    return req.user; // Aquí puedes redirigir o devolver datos del usuario
  }

  
}
