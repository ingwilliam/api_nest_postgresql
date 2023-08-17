import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  
  constructor(private readonly configService:ConfigService){    
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_NAME'),
      api_key: this.configService.get('CLOUDINARY_KEY'),
      api_secret: this.configService.get('CLOUDINARY_SECRET')
    })

  }

  async upload(files:Express.Multer.File[]):Promise<any[]>{
    const urls = await Promise.all(
      files.map(async (file) => {
        const url = await cloudinary.uploader.upload(file.path);
        return {
            url:url.url,
            nombre:file.originalname
          };
      }),
    );

    return urls;    

  }

}
