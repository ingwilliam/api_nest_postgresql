import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { LoginUsuarioDto, RegistroUsuarioDto, RegistroUsuarioGoogleDto } from './dto/';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Rol, UsuarioRol, Usuario } from '../usuarios/entities';
import { ConfigService } from '@nestjs/config';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';
import { handleDBExceptions } from 'src/common/helpers/class.helper';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(UsuarioRol)
    private readonly usuarioRolRepository: Repository<UsuarioRol>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {

  }

  async create(registroUsuarioDto: RegistroUsuarioDto) {

    try {

      const rol = await this.rolRepository.findOne({ where: { rol: 'USER' } });

      const { password, ...userData } = registroUsuarioDto;

      const usuario = this.usuarioRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
        usuarioRoles: [this.usuarioRolRepository.create({ rol: rol })],
      });

      await this.usuarioRepository.save(usuario);

      delete usuario.password;

      console.log({registroUsuarioDto,context:AuthService.name,"description":"Sale del register"});    
      
      return {
        ...usuario,
        token: this.getJwtToken({ email: usuario.email, id: usuario.id })
      };

    } catch (error) {
      handleDBExceptions(error, this.configService);
    }


  }

  async createExterno(email: string, nombreCompleto: string, picture: string, autenticacion: string) {

    try {

      let usuario = await this.usuarioRepository.findOne({ where: { email: email } });

      if (!usuario) {


        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

          const roles = ['USER']
          const userData: CreateUsuarioDto = {
            email,
            password: bcrypt.hashSync(this.configService.get('USER_PASSWORD_DEFAULT'), 10),
            nombreCompleto,
            activo: true,
            autenticacion
          };


          usuario = queryRunner.manager.create(Usuario, {
            ...userData,
            usuarioRoles: await Promise.all(roles.map(async r => {
              const rol = await queryRunner.manager.findOne(Rol, { where: { rol: r } });
              if (!rol) {
                throw new BadRequestException(`El rol no existe ${r}`);
              }

              return queryRunner.manager.create(UsuarioRol, { rol });
            })),
          });

          await queryRunner.manager.save(usuario);
          await queryRunner.commitTransaction();
          await queryRunner.release();

        } catch (error) {

          await queryRunner.rollbackTransaction();
          await queryRunner.release();

          handleDBExceptions(error, this.configService,usuario);
        }


      }

      if (!usuario.activo) {
        throw new UnauthorizedException('Hable con el administrador, usuario bloqueado')
      }


      console.log({"usuario":email,context:AuthService.name,"description":`Sale del login ${autenticacion}`});    

      return {
        ...usuario,
        token: this.getJwtToken({ email: usuario.email, id: usuario.id })
      };


    } catch (error) {

      handleDBExceptions(error, this.configService);
    }


  }

  async checkAuthStatus(usuario: Usuario) {

    try {
      
      console.log({usuario:usuario.email,context:AuthService.name,"description":"Ingresa al login"});    

      return {
        ...usuario,
        token: this.getJwtToken({ email: usuario.email, id: usuario.id })
      };

    } catch (error) {
      handleDBExceptions(error, this.configService,usuario);
    }
    

  }


  async login(loginUserDto: LoginUsuarioDto) {

    try {
      const { password, email } = loginUserDto;

      const usuario = await this.usuarioRepository.findOne({
        where: { email },
        select: { email: true, password: true, id: true },
        relations: ['usuarioRoles', 'usuarioRoles.rol']
      });

      if (!usuario) {
        throw new UnauthorizedException('Credenciales no son validas')
      }

      if (!bcrypt.compareSync(password, usuario.password)) {
        throw new UnauthorizedException('Credenciales no son validas')
      }

      console.log({loginUserDto,context:AuthService.name,"description":"Sale del login"});    

      return {
        ...usuario,
        token: this.getJwtToken({ email: usuario.email, id: usuario.id })
      };

    } catch (error) {
      handleDBExceptions(error, this.configService);
    }



  }

  private getJwtToken(payload: JwtPayload) {

    const token = this.jwtService.sign(payload);
    return token;


  }

}
