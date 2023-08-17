import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, ParseUUIDPipe } from '@nestjs/common';
import { CreateRepositorioDto } from './dto/create-repositorio.dto';
import { UpdateRepositorioDto } from './dto/update-repositorio.dto';
import { Usuario } from 'src/auth/entities';
import { Repositorio } from './entities/repositorio.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

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

      this.handleDBExceptions(error);
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

      this.handleDBExceptions(error);
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

  private handleDBExceptions(error: any) {
    
    const errores:string[] = this.configService.get('CODIDOS_ERRORES_POSGRSQL').split(",");    

    if(errores.includes(error.code))
      throw new BadRequestException(error.detail);

    this.logger.error(error)
        
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }

}
