import { applyDecorators, createParamDecorator, ExecutionContext, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { fileName,fileFilter } from '../helpers/files.helper';

export function CargarArchivos(fieldName: string, maxCount: number, fileSizeMB: number,destination?:string) {
    return applyDecorators(
      UseInterceptors(
        FilesInterceptor(fieldName, maxCount, {
          limits: {
            fileSize: fileSizeMB * 1024 * 1024,
          },
          storage: destination ? diskStorage({ // Usar diskStorage si hay una carpeta de destino
            destination: destination,
            filename: fileName,
          }) : memoryStorage(),
          fileFilter: fileFilter,
        }),
      ),
    );
  }

  export const PathArchivos = createParamDecorator((data:string,ctx:ExecutionContext)=>{

    const req =ctx.switchToHttp().getRequest();
    let urls=[];
    
    if(req.files)
    {
      const files = req.files as Express.Multer.File[];
      urls=files.map(({path,originalname,filename}) => {
        return {url:path,nombre:originalname,filename};      
      });
    }

    return urls;
});