import { Request } from "express";
import {v4 as uuid} from 'uuid';

export const fileFilter = (req:Request,file:Express.Multer.File,callback:Function)=>{

    const fileExtension = file.mimetype.split('/')[1];
    const validExtension = ['jpg','jpeg','png','gif','pdf'];
    
    if(validExtension.includes(fileExtension))
    {
        callback(null,true);
    }
    else
    {
        callback(null,false);
    }    

}

export const fileName = (req:Request,file:Express.Multer.File,callback:Function)=>{

    if(!file){
        callback(new Error('No hay archivo'),false);    
    }

    const fileExtension = file.mimetype.split('/')[1];
    const fileName = `${uuid()}.${fileExtension}`;

    callback(null,fileName);

}