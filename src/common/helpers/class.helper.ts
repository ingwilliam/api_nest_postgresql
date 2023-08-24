import { BadRequestException, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Usuario } from "src/usuarios/entities";

export const handleDBExceptions = (error: any,configService:ConfigService,usuario?:Usuario)=>{


    const errores:string[] = configService.get('CODIDOS_ERRORES_POSGRSQL').split(",");    
    const email = usuario?usuario.email:'';

    if(errores.includes(error.code))
    {
      console.error({"usuario":email,"description":error.detail})
      throw new BadRequestException(error.detail);
    }

    if(error.response)
    {
        console.error({"usuario":email,"description":error.response.message})
        throw new BadRequestException(error.response.message);
    }
    
    console.error({"usuario":email||'',"description":error})
        
    throw new InternalServerErrorException('Unexpected error, check server logs');




    
    
    

    

}