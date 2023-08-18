import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { LoginUsuarioDto, RegistroUsuarioDto, RegistroUsuarioGoogleDto } from './dto/';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Rol, UsuarioRol, Usuario } from '../usuarios/entities';
import { ConfigService } from '@nestjs/config';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService')

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(UsuarioRol)
    private readonly usuarioRolRepository: Repository<UsuarioRol>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,        
  ) {

  }

  async create(registroUsuarioDto: RegistroUsuarioDto) {

    try {

      const rol = await this.rolRepository.findOne({ where: { rol: 'USER' } });

      const { password, ...userData } = registroUsuarioDto;

      const user = this.usuarioRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
        usuarioRoles: [this.usuarioRolRepository.create({ rol: rol })],
      });

      await this.usuarioRepository.save(user);

      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ email: user.email, id: user.id })
      };

    } catch (error) {
      this.handleDBExceptions(error);
    }


  }

  async createGoogle(registroUsuarioDto: RegistroUsuarioGoogleDto) {

    try {

      const { token } = registroUsuarioDto;

      // const { email, nombreCompleto, picture } = await this.googleStrategy.validar(token);

      // let usuario = await this.usuarioRepository.findOne({ where: { email } });

      // if (!usuario) {

      //   const registroUsuarioDto: CreateUsuarioDto = {
      //     email,
      //     password: bcrypt.hashSync(this.configService.get('USER_PASSWORD_DEFAULT'),10),
      //     nombreCompleto,
      //     activo: true,
      //     autenticacion: 'GOOGLE',
      //     roles: ['USER']
      //   };

      //   usuario = await this.usuarioRepository.create(registroUsuarioDto);

      //   usuario = await this.usuarioRepository.save(usuario);

      // }

      // if ( !usuario.activo ) {
      //   throw new UnauthorizedException('Hable con el administrador, usuario bloqueado')
      // }


      // return {
      //   ...usuario,
      //   token: this.getJwtToken({ email: usuario.email, id: usuario.id })
      // };
      return {}

    } catch (error) {

      this.handleDBExceptions(error);
    }


  }

  async checkAuthStatus(user: Usuario) {

    return {
      ...user,
      token: this.getJwtToken({ email: user.email, id: user.id })
    };

  }


  async login(loginUserDto: LoginUsuarioDto) {

    const { password, email } = loginUserDto;

    const user = await this.usuarioRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
      relations: ['usuarioRoles', 'usuarioRoles.rol']
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales no son validas')
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credenciales no son validas')
    }

    return {
      ...user,
      token: this.getJwtToken({ email: user.email, id: user.id })
    };

  }

  private getJwtToken(payload: JwtPayload) {

    const token = this.jwtService.sign(payload);
    return token;


  }

  private handleDBExceptions(error: any): never {

    const errores: string[] = this.configService.get('CODIDOS_ERRORES_POSGRSQL').split(",");
    
    if(errores.includes(error.code))
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }

}
