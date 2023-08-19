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
    private readonly dataSource: DataSource,
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
      handleDBExceptions(error, this.logger, this.configService);
    }


  }

  async createExterno(email: string, nombreCompleto: string, picture: string, autenticacion: string) {

    try {

      console.log(email);
      

      let usuario = await this.usuarioRepository.findOne({ where: { email:email } });

      console.log(usuario);

      console.log('----------------');
      
      

      if (!usuario) {


        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

          const roles = ['USER']
          const userData: CreateUsuarioDto = {
            email,
            password: bcrypt.hashSync(this.configService.get('USER_PASSWORD_DEFAULT'),10),
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

          handleDBExceptions(error, this.logger, this.configService);
        }


      }

      if (!usuario.activo) {
        throw new UnauthorizedException('Hable con el administrador, usuario bloqueado')
      }


      return {
        ...usuario,
        token: this.getJwtToken({ email: usuario.email, id: usuario.id })
      };


    } catch (error) {

      handleDBExceptions(error, this.logger, this.configService);
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

}
