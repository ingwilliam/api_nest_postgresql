import { IsBoolean, IsIn, IsOptional, IsString, MinLength } from "class-validator";

export class CreateRepositorioDto {

    @IsIn(['Usuario','N'])
    repositorio: string;

    @IsIn(['PERFIL'])        
    tipo: string;

    @IsOptional()
    @IsBoolean()
    activo: boolean;
    
}
