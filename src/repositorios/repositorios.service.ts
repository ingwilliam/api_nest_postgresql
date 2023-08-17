import { Injectable } from '@nestjs/common';
import { CreateRepositorioDto } from './dto/create-repositorio.dto';
import { UpdateRepositorioDto } from './dto/update-repositorio.dto';
import { Usuario } from 'src/auth/entities';
import { Repositorio } from './entities/repositorio.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class RepositoriosService {

  constructor(
    @InjectRepository(Repositorio)
    private readonly repositorioRepository: Repository<Repositorio>    
  ) {

  }

  async create(createRepositorioDto: CreateRepositorioDto,usuario:Usuario,urls?:string[]) {
    
    const repositorios = await Promise.all(urls.map(async (url)=>{
      return await this.repositorioRepository.save({
        ...createRepositorioDto,
        url,
        usuario,
      });
    }));

    return repositorios;


  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, page = 0 } = paginationDto;

    const [rows, total] = await this.repositorioRepository.findAndCount({
      where: {
        activo: true,
      },
      take: limit,
      skip: page*limit,
      relations:{
        usuario:true,        
      },
      order: {
        nombre: 'ASC',
      }
    });

    return {
      total,
      page,
      limit,
      rowsTotal:rows.length,
      rows
    }

  }

  findOne(id: number) {
    return `This action returns a #${id} repositorio`;
  }

  update(id: number, updateRepositorioDto: UpdateRepositorioDto) {
    return `This action updates a #${id} repositorio`;
  }

  remove(id: number) {
    return `This action removes a #${id} repositorio`;
  }
}
