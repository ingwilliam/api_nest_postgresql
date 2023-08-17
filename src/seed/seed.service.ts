import { Injectable } from '@nestjs/common';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities';

@Injectable()
export class SeedService {
  
  constructor(    
    @InjectRepository(Usuario)
    private readonly userRepository:Repository<Usuario>,
    ) {}

  async runSeed(){

    //await this.deleteTables();

    const adminUsers = await this.insertUsers();

    //await this.insertNewProducts(adminUsers);

    return 'executeSeed'
  }  

  private async insertUsers(){
    
    const seedUsers=initialData.users;

    const users: Usuario[] = [];

    seedUsers.forEach( user=>{
      //users.push(this.userRepository.create(user))
    });

    const dbUsers = []; //await this.userRepository.save(seedUsers)

    return dbUsers[0];

  }
 
}  
