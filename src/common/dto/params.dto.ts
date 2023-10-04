import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';


export class ParamsDto {

    @IsOptional()    
    menu?: string;    

}