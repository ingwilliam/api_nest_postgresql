import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { DataSource, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config';
import { Rol, UsuarioRol } from './entities';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { handleDBExceptions } from 'src/common/helpers/class.helper';

@Injectable()
export class UsuariosService {

  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(UsuarioRol)
    private readonly usuarioRolRepository: Repository<UsuarioRol>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService
  ) {

  }

  async create(createUsuarioDto: CreateUsuarioDto, usuario: Usuario) {


    let { roles, password, ...userData } = createUsuarioDto;


    let validateEmail = await this.usuarioRepository.findOne({ where: { email: createUsuarioDto.email } });

    if (!validateEmail) {


      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {

        if (!roles) {
          roles = ['USER']
        }

        const usuariocreate = queryRunner.manager.create(Usuario, {
          ...userData,
          password: bcrypt.hashSync(password, 10),
          usuarioRoles: await Promise.all(roles.map(async r => {
            const rol = await queryRunner.manager.findOne(Rol, { where: { rol: r } });
            if (!rol) {
              throw new BadRequestException(`El rol no existe ${r}`);
            }

            return queryRunner.manager.create(UsuarioRol, { rol });
          })),
        });

        await queryRunner.manager.save(usuariocreate);
        await queryRunner.commitTransaction();
        await queryRunner.release();

        delete usuariocreate.password;

        console.log({ usuario: usuario.email, context: UsuariosService.name, "description": "Sale de crear el registro" });

        return { id: usuariocreate.id };

      } catch (error) {

        await queryRunner.rollbackTransaction();
        await queryRunner.release();

        handleDBExceptions(error, this.configService, usuario);
      }
    }
    else {
      throw new BadRequestException(`El email ${validateEmail.email} ya existe`);
    }

  }

  async findAll(paginationDto: PaginationDto, usuario: Usuario) {

    try {
      const { limit = 10, page = 0 } = paginationDto;
      const [rows, total] = await this.usuarioRepository
        .createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.usuarioRoles', 'usuarioRol')
        .leftJoinAndSelect('usuarioRol.rol', 'rol')
        .select([
          'usuario.id',
          'usuario.nombres',
          'usuario.apellidos',
          'usuario.email',
          'usuario.activo',
          'usuario.autenticacion',
          'usuario.createdAt',
          'usuario.updatedAt',
          'usuarioRol.id',
          'rol.rol'
        ])
        // .where('usuario.activo = :activo', { activo: true })
        .take(limit)
        .skip(page * limit)
        .orderBy('usuario.createdAt', 'DESC')
        .getManyAndCount();

      console.log({ "usuario": usuario.email, context: UsuariosService.name, "description": 'Sale de consultar todos los registros' });

      return {
        total,
        page,
        limit,
        rowsTotal: rows.length,
        rows
      }
    } catch (error) {
      handleDBExceptions(error, this.configService, usuario);
    }


  }

  async findRoles(usuario: Usuario) {
    try {

      const roles = await this.rolRepository.find({ select: ['rol', 'id'], where: { activo: true } });

      console.log({ "usuario": usuario.email, context: UsuariosService.name, "description": 'Sale de consultar todos los roles' });

      return roles;

    } catch (error) {
      handleDBExceptions(error, this.configService, usuario);
    }

  }

  async findOne(id: string, usuario: Usuario) {
    try {

      console.log({ usuario: usuario.email, context: UsuariosService.name, "description": "Ingresa a consultar el registro" });

      const usuariofind = await this.usuarioRepository.findOne({
        where: { id: id },
        relations: ['usuarioRoles', 'usuarioRoles.rol']
      });

      if (!usuariofind) {
        throw new NotFoundException(`El usuario  no existe "${id}"`);
      }

      const {createdAt,updatedAt,autenticacion,usuarioRoles,...userData} = usuariofind

      const roles = []
      for(const key of Object.keys(usuarioRoles)){
          roles.push(usuarioRoles[key].rol.rol);
      }

      userData['roles']=roles
      
      delete userData.id

      return userData;

    } catch (error) {
      handleDBExceptions(error, this.configService, usuario);
    }

  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto, usuario: Usuario) {
    const { roles, password, ...userData } = updateUsuarioDto;

    let validateEmail = await this.usuarioRepository.findOne({ where: { email: updateUsuarioDto.email,id:Not(id) } });

    if (!validateEmail) {

      const usuariofind = await this.usuarioRepository.preload({
        id,
        ...userData
      });

      if (password) {
        usuariofind.password = bcrypt.hashSync(password, 10);
      }

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {

        if (roles) {
          await queryRunner.manager.delete(UsuarioRol, { usuario: { id } });

          usuariofind.usuarioRoles = await Promise.all(roles.map(async r => {
            const rol = await queryRunner.manager.findOne(Rol, { where: { rol: r } });
            if (!rol) {
              throw new BadRequestException(`El rol no existe ${r}`);
            }

            return queryRunner.manager.create(UsuarioRol, { rol });
          }));

        }

        await queryRunner.manager.save(usuariofind);
        await queryRunner.commitTransaction();
        await queryRunner.release();

        delete usuariofind.password;

        console.log({ usuario: usuario.email, context: UsuariosService.name, "description": "Sale de actualizar el registro" });


        return { id: usuariofind.id };

      } catch (error) {

        await queryRunner.rollbackTransaction();
        await queryRunner.release();

        handleDBExceptions(error, this.configService, usuario);
      }

    }
    else {
      throw new BadRequestException(`El email ${validateEmail.email} ya existe`);
    }

  }

  async remove(id: string, usuario: Usuario) {

    try {

      const usuariofind = await this.usuarioRepository.findOneBy({ id });

      if (!usuariofind) {
        throw new NotFoundException(`El usuario  no existe "${id}"`);
      }

      usuariofind.activo = (usuariofind.activo) ? false : true;

      console.log({ usuario: usuario.email, context: UsuariosService.name, "description": "Sale de eliminar el registro" });

      return await this.usuarioRepository.save(usuariofind);

    } catch (error) {
      handleDBExceptions(error, this.configService, usuario);
    }



  }

}
