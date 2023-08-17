import { Injectable } from '@nestjs/common';
import { CreateRepositorioDto } from './dto/create-repositorio.dto';
import { UpdateRepositorioDto } from './dto/update-repositorio.dto';
import { Usuario } from 'src/auth/entities';
import { Repositorio } from './entities/repositorio.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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

  findAll() {
    return `This action returns all repositorios`;
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
