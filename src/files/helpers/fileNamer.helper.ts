import { Request } from "express";
import {v4 as uuid} from 'uuid'


export const fileNamer = (req:Request,file:Express.Multer.File,callback:Function)=>{

    //console.log({file});
    
    if(!file){
        callback(new Error('No hay archivo'),false);    
    }

    const fileExtension = file.mimetype.split('/')[1];
    const fileName = `${uuid()}.${fileExtension}`;

    callback(null,fileName);

}