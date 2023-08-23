import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction,Request, Response } from 'express';
import {v4 as uuid} from 'uuid';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {

  constructor(
    private readonly configService: ConfigService,    
  ) {

  }  

  use(req:Request, res: Response, next:NextFunction) {

    const id = uuid();
    req['correlationId']=id;
    res.set('correlationId',id);
    next();
  }
}