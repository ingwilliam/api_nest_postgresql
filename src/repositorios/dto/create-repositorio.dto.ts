import { IsBoolean, IsIn, IsOptional, IsString, MinLength } from "class-validator";

export class CreateRepositorioDto {

    @IsIn(['Usuario'])
    repositorio: string;

    @IsOptional()
    @IsBoolean()
    activo: boolean;
    
}
