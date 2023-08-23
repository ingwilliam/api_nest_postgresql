import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers, SetMetadata, Logger } from '@nestjs/common';
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

  private readonly logger = new Logger();

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: RegistroUsuarioDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUsuarioDto) {
    this.logger.log({loginUserDto,context:AuthController.name});    
    return this.authService.login(loginUserDto);
  }

  @Get('ckeck-jwt')
  @Auth()
  ckeckjwt(
    @GetUsuario() user:Usuario,    
    ) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req) {
    const {email,name,photo} = req.user;
    console.log(req.user);
    return await this.authService.createExterno(req.user.email,req.user.name,req.user.photo,'GOOGLE');
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookLogin() {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginCallback(@Req() req) {    
    const {email,name,photo} = req.user;

    console.log(req.user);
    
    return await this.authService.createExterno(req.user.email,req.user.name,req.user.photo,'FACEBOOK');
  }

  
}
