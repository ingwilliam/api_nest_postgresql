import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';



@Injectable()
export class FilesService {

  getStaticProductImage(imageName:string){
    const path =  join(__dirname, '../../static/products',imageName);
    if(!existsSync){
      throw new BadRequestException(`No existe la imagen ${imageName}`);
    }
    return path;
  }

}
