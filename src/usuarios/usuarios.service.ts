import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config';
import { Rol, UsuarioRol } from './entities';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if( !roles )
      {
        roles=['USER']
      }

      const user = queryRunner.manager.create(Usuario, {
        ...userData,
        password: bcrypt.hashSync(password, 10),
        usuarioRoles: await Promise.all(roles.map(async r=>{
          const rol = await queryRunner.manager.findOne(Rol, { where: {rol: r} });
          if(!rol){
            throw new BadRequestException(`El rol no existe ${r}`);
          }
          
          return queryRunner.manager.create(UsuarioRol,{rol});
        })),
      });

      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      delete user.password;

      return user;

    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDBExceptions(error);
    }


  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, page = 0 } = paginationDto;
    const [rows, total] = await this.usuarioRepository
    .createQueryBuilder('usuario')
    .leftJoinAndSelect('usuario.usuarioRoles', 'usuarioRol')
    .leftJoinAndSelect('usuarioRol.rol', 'rol')
    .select([
      'usuario.id',
      'usuario.nombreCompleto',
      'usuario.email',
      'usuario.activo',
      'usuarioRol.id',    
      'rol.rol'           
    ])
    .where('usuario.activo = :activo', { activo: true })
    .take(limit)
    .skip(page * limit)
    .orderBy('usuario.nombreCompleto', 'ASC')
    .getManyAndCount();

    return {
      total,
      page,
      limit,
      rowsTotal: rows.length,
      rows
    }
  }

  async findOne(id:string) {
    return await this.usuarioRepository.findOne({
      where: { id: id },
      relations: ['usuarioRoles', 'usuarioRoles.rol']
    });
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const { roles, password, ...userData } = updateUsuarioDto;
   
    const usuario = await this.usuarioRepository.preload({
      id,
      ...userData          
    });

    if(password)
    {
      usuario.password = bcrypt.hashSync(password, 10);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if( roles )
      {
        await queryRunner.manager.delete(UsuarioRol,{usuario:{id}});

        usuario.usuarioRoles = await Promise.all(roles.map(async r=>{
          const rol = await queryRunner.manager.findOne(Rol, { where: {rol: r} });
          if(!rol){
            throw new BadRequestException(`El rol no existe ${r}`);
          }
          
          return queryRunner.manager.create(UsuarioRol,{rol});
        }));
        
      } 

      console.log(usuario);
      

      await queryRunner.manager.save(usuario);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      delete usuario.password;

      return usuario;

    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDBExceptions(error);
    }
  }

  async remove(id: string){
    const usuario = await this.usuarioRepository.findOneBy({ id });

    if (!usuario) {
      throw new NotFoundException(`El usuario  no existe "${id}"`);
    }

    usuario.activo = false;
    
    return await this.usuarioRepository.save(usuario);

  }

  private handleDBExceptions(error: any) {
    
    const errores:string[] = this.configService.get('CODIDOS_ERRORES_POSGRSQL').split(",");    

    if(errores.includes(error.code))
      throw new BadRequestException(error.detail);

    this.logger.error(error)
        
    throw new InternalServerErrorException(error.response);

  }

}
