import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/auth/entities/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  
  constructor(    
    private readonly productsService: ProductsService,
    @InjectRepository(Usuario)
    private readonly userRepository:Repository<Usuario>,
    ) {}

  async runSeed(){

    await this.deleteTables();

    const adminUsers = await this.insertUsers();

    //await this.insertNewProducts(adminUsers);

    return 'executeSeed'
  }

  private async deleteTables(){
    await this.productsService.deleteAllProducts();
    const queryBulder = this.userRepository.createQueryBuilder();
    await queryBulder
          .delete()
          .where({})
          .execute()
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
  
  private async insertNewProducts(user:Usuario){
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises=[];

    products.forEach(product=>{
      insertPromises.push(this.productsService.create(product,user));
    });

    await Promise.all(insertPromises);

    return true;

  }
}

