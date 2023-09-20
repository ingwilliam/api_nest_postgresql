import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class RegistroUsuarioDto {

    @IsString({ message: 'El campo nombres es obligatorio y debe ser tipo texto' })
    @MinLength(1,{ message: 'El campo nombres no debe estar vacio' })
    nombres: string;

    @IsString({ message: 'El campo apellidos es obligatorio y debe ser tipo texto' })        
    @MinLength(1,{ message: 'El campo apellidos no debe estar vacio' })
    apellidos: string;

    @IsString({ message: 'El campo email es obligatorio y debe ser tipo texto' })    
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    email: string;

    @IsString({ message: 'El campo contraseña es obligatorio y debe ser tipo texto' })
    @MinLength(6,{ message: 'El campo contraseña debe tener más de 6 caracteres' })
    @MaxLength(50,{ message: 'El campo contraseña debe tener menos de 50 caracteres' })
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe tener una letra mayúscula, minúscula y un número'
    })
    password: string;    
    
}
