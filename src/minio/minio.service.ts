import { Injectable } from '@nestjs/common';
import { CreateMinioDto } from './dto/create-minio.dto';
import { UpdateMinioDto } from './dto/update-minio.dto';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { nameUUID } from 'src/common/helpers/files.helper';

@Injectable()
export class MinioService {

  private readonly minioClient: Minio.Client;
  
  constructor(
    private readonly configService:ConfigService
    ){    
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_SERVER'),
      port: parseInt(this.configService.get('MINIO_PORT')),
      useSSL: false,          // Desactiva SSL si no lo estás usando
      accessKey: this.configService.get('MINIO_API_KEY'),
      secretKey: this.configService.get('MINIO_API_SECRET'),
    });
    
  }
  
  async upload(files: Express.Multer.File[]):Promise<any[]>{

    const urls = await Promise.all(
      files.map(async (file) => {
        const name = nameUUID(file.mimetype)
        await this.minioClient.putObject(this.configService.get('MINIO_BUCKET'), name, file.buffer);        
        return {
          url:await this.minioClient.presignedGetObject(this.configService.get('MINIO_BUCKET'), name),
          filename:name,
          nombre:file.originalname
        };
      }),
    );   
    
    return urls
  }

  async getPublicUrl(fileName: string){
    return await this.minioClient.presignedGetObject(this.configService.get('MINIO_BUCKET'), fileName);    
  }


  create(createMinioDto: CreateMinioDto) {
    return 'This action adds a new minio';
  }

  findAll() {
    return `This action returns all minio`;
  }

  findOne(id: number) {
    return `This action returns a #${id} minio`;
  }

  update(id: number, updateMinioDto: UpdateMinioDto) {
    return `This action updates a #${id} minio`;
  }

  remove(id: number) {
    return `This action removes a #${id} minio`;
  }
}
