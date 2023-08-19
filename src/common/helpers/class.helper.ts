import { BadRequestException, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export const handleDBExceptions = (error: any,logger:Logger,configService:ConfigService)=>{


    const errores:string[] = configService.get('CODIDOS_ERRORES_POSGRSQL').split(",");    

    if(errores.includes(error.code))
      throw new BadRequestException(error.detail);

    if(error.response)
      throw new BadRequestException(error.response.message);

    logger.error(error)
        
    throw new InternalServerErrorException('Unexpected error, check server logs');




    
    
    

    

}