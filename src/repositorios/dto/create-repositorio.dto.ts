import { IsIn, IsString, MinLength } from "class-validator";

export class CreateRepositorioDto {

    @IsString()
    @MinLength(1)
    nombre: string;

    @IsIn(['Usuario'])
    repositorio: string;
    
}
