import { IsBoolean, IsIn, IsOptional, IsString, MinLength, IsUUID } from "class-validator";

export class CreateRepositorioDto {

    @IsIn(['Usuario','N'])
    repositorio: string;

    @IsIn(['PERFIL'])        
    tipo: string;

    @IsOptional()
    @IsBoolean()
    activo: boolean;

    @IsUUID('4', { message: 'El campo uuid debe ser un UUID válido' })    
    usuario: string;
}
