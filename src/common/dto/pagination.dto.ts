import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';


export class PaginationDto {

    @ApiProperty({
        description:'cuantas filas necesitas',
        default:10
    })
    @IsOptional()
    @IsPositive()
    @Type( () => Number ) // enableImplicitConversions: true
    limit?: number;
    
    @ApiProperty({
        description:'cuantas filas quieres saltar',
        default:0
    })
    @IsOptional()    
    @Min(1)
    @Type( () => Number ) // enableImplicitConversions: true
    page?: number;

}