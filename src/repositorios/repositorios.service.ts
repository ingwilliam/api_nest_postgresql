import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, ParseUUIDPipe } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { CreateRepositorioDto } from './dto/create-repositorio.dto';
import { UpdateRepositorioDto } from './dto/update-repositorio.dto';
import { Repositorio } from './entities/repositorio.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { handleDBExceptions } from '../common/helpers/class.helper';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class RepositoriosService {

  private readonly logger = new Logger('RepositoriosService');

  constructor(
    @InjectRepository(Repositorio)
    private readonly repositorioRepository: Repository<Repositorio>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService
  ) {

  }

  async create(createRepositorioDto: CreateRepositorioDto, usuario: Usuario, urls?: string[]) {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const repositorios = await Promise.all(urls.map(async r => {
        const registro = await queryRunner.manager.save(Repositorio, {
          ...createRepositorioDto,
          nombre: r['nombre'],
          url: r['url'],
          usuario,
        })
        return { ...registro, usuario: registro.usuario.nombreCompleto };
      }));

      await queryRunner.commitTransaction();

      await queryRunner.release();

      console.log({ usuario: usuario.email, context: RepositoriosService.name, "description": "Sale de crear el registro" });

      return repositorios;

    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      handleDBExceptions(error, this.configService, usuario);
    }

  }

  async findAll(paginationDto: PaginationDto, usuario: Usuario) {
    try {
      const { limit = 10, page = 0 } = paginationDto;

      const [rows, total] = await this.repositorioRepository.findAndCount({
        where: {
          activo: true,
        },
        take: limit,
        skip: page * limit,
        relations: {
          usuario: true,
        },
        order: {
          nombre: 'ASC',
        }
      });

      console.log({ "usuario": usuario.email, context: RepositoriosService.name, "description": 'Sale de consultar todos los registros' });

      return {
        total,
        page,
        limit,
        rowsTotal: rows.length,
        rows
      }
    } catch (error) {
      handleDBExceptions(error, this.configService, usuario)
    }


  }

  async findOne(id: string, usuario: Usuario) {

    try {

      console.log({ usuario: usuario.email, context: RepositoriosService.name, "description": "Sale de consultar el registro" });

      return await this.repositorioRepository.findOne({
        where: { id: id },
        relations: ['usuario'],
      });


    } catch (error) {
      handleDBExceptions(error, this.configService, usuario);
    }

  }

  async update(id: string, updateRepositorioDto: UpdateRepositorioDto, usuario: Usuario) {

    const repositorio = await this.repositorioRepository.preload({ id, ...updateRepositorioDto });

    if (!repositorio) {
      throw new NotFoundException(`No existe el repositorio id: ${id}`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      await queryRunner.manager.save(repositorio);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      console.log({ usuario: usuario.email, context: RepositoriosService.name, "description": "Sale de actualizar el registro" });

      return repositorio;

    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      handleDBExceptions(error, this.configService, usuario);
    }
  }

  async remove(id: string, usuario: Usuario) {

    try {
      const repositorio = await this.repositorioRepository.findOneBy({ id });

      if (!repositorio) {
        throw new NotFoundException(`El repositorio  no existe "${id}"`);
      }

      repositorio.activo = false;

      console.log({ usuario: usuario.email, context: RepositoriosService.name, "description": "Sale de eliminar el registro" });

      return await this.repositorioRepository.save(repositorio);
    } catch (error) {
      handleDBExceptions(error, this.configService, usuario)
    }
  }
}
