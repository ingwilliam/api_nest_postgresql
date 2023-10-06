import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

import { LoginUsuarioDto, RegistroUsuarioDto, RegistroUsuarioGoogleDto,ChangePasswordDto, ActiveUsuarioDto } from './dto/';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Rol, UsuarioRol, Usuario } from '../usuarios/entities';
import { handleDBExceptions, sendEmailRegister, sendPasswordRegister } from '../common/helpers/class.helper';
import {v4 as uuid} from 'uuid';
import { RepositoriosService } from 'src/repositorios/repositorios.service';
import { fileName } from '../common/helpers/files.helper';


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
    private readonly repositoriosService: RepositoriosService
  ) {

  }

  async create(registroUsuarioDto: RegistroUsuarioDto) {

    try {

      const rol = await this.rolRepository.findOne({ where: { rol: 'USER-EXT' } });

      const { password, ...userData } = registroUsuarioDto;

      let usuario = await this.usuarioRepository.findOne({ where: { email: registroUsuarioDto.email } });

      if (!usuario) {


        usuario = this.usuarioRepository.create({
          ...userData,
          password: bcrypt.hashSync(password, 10),
          usuarioRoles: [this.usuarioRolRepository.create({ rol: rol })],
        });

        await this.usuarioRepository.save(usuario);

        delete usuario.password;


        const sendEmail = await sendEmailRegister(this.configService,usuario.id)

        console.log({ registroUsuarioDto, context: AuthService.name, "description": "Sale del register" });

        if (sendEmail === true) {
          console.log({ registroUsuarioDto, context: AuthService.name, "description": "Correo electrónico de activación enviado con éxito" });
        }
        else {
          console.log({ registroUsuarioDto, context: AuthService.name, "description": `Error al enviar el correo de activación a ${registroUsuarioDto.email}, error ${sendEmail}` });
          throw new BadRequestException(`Error al enviar el correo de activación a ${registroUsuarioDto.email}.`);
        }

        const { token, expirationDate } = this.getJwtToken({ email: usuario.email, usuario: usuario.nombres + +usuario.apellidos, id: usuario.id })
        return {
          token,
          expirationDate
        };
      }
      else {
        throw new BadRequestException(`El email ${registroUsuarioDto.email} ya existe`);
      }

    } catch (error) {
      handleDBExceptions(error, this.configService);
    }


  }


  async active(id: string) {

    try {

      const usuariofind = await this.usuarioRepository.findOneBy({id});

      if (!usuariofind) {
        throw new NotFoundException(`El usuario  no existe "${id}"`);
      }
  
      usuariofind.activo = true;
           
      await this.usuarioRepository.save(usuariofind)

      console.log({usuario:usuariofind.email,context:AuthService.name,"description":"Sale de activar"});            

      return ;      
            

    } catch (error) {
      handleDBExceptions(error, this.configService);
    }

  }
  
  
  async changePassword(changePasswordDto: ChangePasswordDto) {

    try {

      const { email } = changePasswordDto;

      const usuariofind = await this.usuarioRepository.findOne({ where: { email }, });

      if (!usuariofind) {
        throw new NotFoundException(`El usuario  no existe "${email}"`);
      }
  
      const password = uuid();

      usuariofind.password = bcrypt.hashSync(password, 10);
           
      const sendEmail = await sendPasswordRegister(this.configService,usuariofind.email,password)

      console.log({ changePasswordDto, context: AuthService.name, "description": "Sale del register" });

      if (sendEmail === true) {
        console.log({ changePasswordDto, context: AuthService.name, "description": "Correo electrónico de actualización password enviado con éxito" });
      }
      else {
        console.log({ changePasswordDto, context: AuthService.name, "description": `Error al enviar el correo de actualización password a ${changePasswordDto.email}, error ${sendEmail}` });
        throw new BadRequestException(`Error al enviar el correo de activación a ${changePasswordDto.email}.`);
      }

      await this.usuarioRepository.save(usuariofind)
      
      console.log({usuario:email,context:AuthService.name,"description":"Sale de actualizar el password"});            
      

      return ;      
            

    } catch (error) {
      handleDBExceptions(error, this.configService);
    }


  }


  async createExterno(email: string, nombres: string,apellidos: string, picture: string, autenticacion: string) {

    try {

      let usuarioFind = await this.usuarioRepository.findOne({
        where: { email },
        select: { email: true, nombres: true, apellidos: true, password: true, activo: true, id: true },        
        relations: ['usuarioRoles', 'usuarioRoles.rol']
      });

      if (!usuarioFind) {


        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

          const roles = ['USER-EXT']
          const userData: CreateUsuarioDto = {
            email,
            password: bcrypt.hashSync(this.configService.get('USER_PASSWORD_DEFAULT'), 10),
            nombres,
            apellidos,
            activo: true,
            autenticacion
          };


          usuarioFind = queryRunner.manager.create(Usuario, {
            ...userData,
            usuarioRoles: await Promise.all(roles.map(async r => {
              const rol = await queryRunner.manager.findOne(Rol, { where: { rol: r } });
              if (!rol) {
                throw new BadRequestException(`El rol no existe ${r}`);
              }

              return queryRunner.manager.create(UsuarioRol, { rol });
            })),
          });

          await queryRunner.manager.save(usuarioFind);
          await queryRunner.commitTransaction();
          await queryRunner.release();

        } catch (error) {

          await queryRunner.rollbackTransaction();
          await queryRunner.release();

          handleDBExceptions(error, this.configService, usuarioFind);
        }


      }

      if (!usuarioFind.activo) {
        throw new UnauthorizedException('Hable con el administrador, usuario bloqueado')
      }

      delete usuarioFind.password

      const {usuarioRoles,...usuario} = usuarioFind

      const tipoUsuario = usuarioRoles
        .filter((usuario) => this.configService.get('TIPO_USUARIO').split(',').includes(usuario.rol.rol))
        .map((usuario) => usuario.rol.rol);
      

      const img = await this.repositoriosService.findImgPerfilUser(usuarioFind)

      const foto = (img)?`${this.configService.get('HOST_API')}/repositorios/view/${img}`:null

      console.log({ "usuario": email, context: AuthService.name, "description": `Sale del login ${autenticacion}` });

      return {
        usuario:{...usuario,foto},
        tipoUsuario,
        ...this.getJwtToken({ email: usuario.email, usuario: usuario.nombres + ' ' + usuario.apellidos, id: usuario.id })
      };


    } catch (error) {

      handleDBExceptions(error, this.configService);
    }


  }

  async checkAuthStatus(usuario: Usuario) {

    try {

      const {id,email,nombres,apellidos,activo,usuarioRoles}=usuario

      const img = await this.repositoriosService.findImgPerfilUser(usuario)

      const foto = (img)?`${this.configService.get('HOST_API')}/repositorios/view/${img}`:null

      const tipoUsuario = usuarioRoles
        .filter((usuario) => this.configService.get('TIPO_USUARIO').split(',').includes(usuario.rol.rol))
        .map((usuario) => usuario.rol.rol);

      console.log({ usuario: usuario.email, context: AuthService.name, "description": "Sale del login" });

      return {
        usuario:{id,email,nombres,apellidos,activo,foto},
        tipoUsuario,
        ...this.getJwtToken({ email: usuario.email, usuario: usuario.nombres + ' ' + usuario.apellidos, id: usuario.id })
      };

    } catch (error) {
      handleDBExceptions(error, this.configService, usuario);
    }


  }

  async login(loginUserDto: LoginUsuarioDto) {

    try {
      const { password, email } = loginUserDto;

      const usuarioFind = await this.usuarioRepository.findOne({
        where: { email },
        select: { email: true, nombres: true, apellidos: true, password: true, activo: true, id: true },        
        relations: ['usuarioRoles', 'usuarioRoles.rol']
      });

      if (!usuarioFind) {
        throw new UnauthorizedException('Credenciales no son validas')
      }

      if (!bcrypt.compareSync(password, usuarioFind.password)) {
        throw new UnauthorizedException('Credenciales no son validas')
      }

      if (!usuarioFind.activo) {
        throw new UnauthorizedException(`Su cuenta no esta activa. revise su bandeja de entrada del email ${usuarioFind.email}, con el asunto (${this.configService.get('NAME_APLICATION')} - Activación de usuario) y active su cuenta`)
      }

      delete usuarioFind.password

      const {usuarioRoles,...usuario} = usuarioFind

      const tipoUsuario = usuarioRoles
        .filter((usuario) => this.configService.get('TIPO_USUARIO').split(',').includes(usuario.rol.rol))
        .map((usuario) => usuario.rol.rol);
      

      const img = await this.repositoriosService.findImgPerfilUser(usuarioFind)

      const foto = (img)?`${this.configService.get('HOST_API')}/repositorios/view/${img}`:null

      console.log({ loginUserDto, context: AuthService.name, "description": "Sale del login" });

      return {
        usuario:{...usuario,foto},
        tipoUsuario,
        ...this.getJwtToken({ email: usuario.email, usuario: usuario.nombres + ' ' + usuario.apellidos, id: usuario.id })
      };

    } catch (error) {
      handleDBExceptions(error, this.configService);
    }



  }



  

  private getJwtToken(payload: JwtPayload) {

    const token = this.jwtService.sign(payload);
    const decodedToken = this.jwtService.verify(token);
    return { token, expirationDate: decodedToken.exp };


  }

}
