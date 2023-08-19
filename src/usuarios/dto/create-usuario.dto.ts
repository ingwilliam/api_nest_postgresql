import { IsArray, IsBoolean, IsEmail, IsIn, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUsuarioDto {

    @IsString()    
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe tener una letra mayúscula, minúscula y un número'
    })
    password: string;

    @IsString()
    @MinLength(1)
    nombreCompleto: string;

    @IsBoolean()
    activo: boolean;

    @IsIn(['BASICA','GOOGLE'])    
    @IsOptional()
    autenticacion?: string;

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    roles?: string[]
    
}
