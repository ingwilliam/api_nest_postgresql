import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, ParseUUIDPipe } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { CreateRepositorioDto } from './dto/create-repositorio.dto';
import { UpdateRepositorioDto } from './dto/update-repositorio.dto';
import { Repositorio } from './entities/repositorio.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Usuario } from '../usuarios/entities';
import { handleDBExceptions } from '../common/helpers/class.helper';

@Injectable()
export class RepositoriosService {

  private readonly logger = new Logger('RepositoriosService');

  constructor(
    @InjectRepository(Repositorio)
    private readonly repositorioRepository: Repository<Repositorio>,
    private readonly dataSource:DataSource,    
    private readonly configService: ConfigService
  ) {

  }

  async create(createRepositorioDto: CreateRepositorioDto, usuario: Usuario, urls?: string[]) {

    console.log('entro');
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try
    {
      const repositorios = await Promise.all(urls.map(async r => {
        const registro = await queryRunner.manager.save(Repositorio,{
          ...createRepositorioDto,
          nombre: r['nombre'],
          url: r['url'],
          usuario,
        })
        return { ...registro, usuario: registro.usuario.nombreCompleto };
      }));
        
      await queryRunner.commitTransaction();

      await queryRunner.release();

      return repositorios;
      
    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      handleDBExceptions(error,this.logger,this.configService);
    }

  }

  async findAll(paginationDto: PaginationDto) {
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

    return {
      total,
      page,
      limit,
      rowsTotal: rows.length,
      rows
    }

  }

  async findOne(id:string) {
    return await this.repositorioRepository.findOne({
      where: { id: id },
      relations: ['usuario'],
    });
  }

  async update(id: string, updateRepositorioDto: UpdateRepositorioDto) {

    const repositorio = await this.repositorioRepository.preload({id,...updateRepositorioDto});
    
    if ( !repositorio ){
      throw new NotFoundException(`No existe el repositorio id: ${ id }`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      await queryRunner.manager.save(repositorio);
      
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return repositorio;
      
    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      handleDBExceptions(error,this.logger,this.configService);
    }    
  }

  async remove(id: string) {
    const repositorio = await this.repositorioRepository.findOneBy({ id });

    if (!repositorio) {
      throw new NotFoundException(`El repositorio  no existe "${id}"`);
    }

    repositorio.activo = false;
    
    return await this.repositorioRepository.save(repositorio);

  }
}
