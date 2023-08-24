import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers, SetMetadata, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistroUsuarioDto , LoginUsuarioDto } from './dto/';
import { AuthGuard } from '@nestjs/passport';
import { GetUsuario,Auth } from './decorators';



import { ApiTags } from '@nestjs/swagger';
import { Usuario } from '../usuarios/entities';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: RegistroUsuarioDto) {
    console.log({createUserDto,context:AuthController.name,"description":"Ingresa a register"});    
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUsuarioDto) {
    console.log({loginUserDto,context:AuthController.name,"description":"Ingresa al login"});    
    return this.authService.login(loginUserDto);  
  }

  @Get('ckeck-jwt')
  @Auth()
  ckeckjwt(
    @GetUsuario() usuario:Usuario,    
    ) {
    console.log({usuario:usuario.email,context:AuthController.name,"description":"Ingresa al login"});    
    return this.authService.checkAuthStatus(usuario);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req) {    
    const {email,name,photo} = req.user;    
    console.log({"usuario":email,context:AuthController.name,"description":"Ingresa a login google"});    
    return await this.authService.createExterno(email,name,photo,'GOOGLE');
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookLogin() {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginCallback(@Req() req) {    
    const {email,name,photo} = req.user;
    console.log({"usuario":email,context:AuthController.name,"description":"Ingresa a login FACEBOOK"});    
    return await this.authService.createExterno(email,name,photo,'FACEBOOK');
  }

  
}
