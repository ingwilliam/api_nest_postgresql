import { BadRequestException, ForbiddenException, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Usuario } from "src/usuarios/entities";
import * as nodemailer from 'nodemailer';
import { templatePassword, templateRegister } from "./templates.mail.helper";

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
        throw new ForbiddenException(error.response.message);
    }
    
    console.error({"usuario":email||'',"description":error})
        
    throw new InternalServerErrorException('Unexpected error, check server logs');


}


export const sendEmailRegister = async(configService:ConfigService,id)=>{

  const transporter = nodemailer.createTransport({
    host: "localhost",    
    port: 1025,
    secure: false,    
  });

  // Configura los detalles del correo
  const mailOptions: nodemailer.SendMailOptions = {
    from: 'ingeniero.wb@gmail.com',
    to:'barbosawilliam10@hotmail.com',
    subject:`${configService.get('NAME_APLICATION')} - Activación de usuario`,    
    html: templateRegister(configService.get('NAME_APLICATION'),configService.get('URL_APLICATION'),id)

  };

  try {
    // Envía el correo electrónico
    await transporter.sendMail(mailOptions);
    return true

  } catch (error) {
    return error;
  }

}

export const sendPasswordRegister = async(configService:ConfigService,email,password)=>{

  const transporter = nodemailer.createTransport({
    host: "localhost",    
    port: 1025,
    secure: false,    
  });

  // Configura los detalles del correo
  const mailOptions: nodemailer.SendMailOptions = {
    from: 'ingeniero.wb@gmail.com',
    to:email,
    subject:`${configService.get('NAME_APLICATION')} - Cambio de contraseña`,    
    html: templatePassword(configService.get('NAME_APLICATION'),configService.get('URL_APLICATION'),email,password)

  };

  try {
    // Envía el correo electrónico
    await transporter.sendMail(mailOptions);
    return true

  } catch (error) {
    return error;
  }

}