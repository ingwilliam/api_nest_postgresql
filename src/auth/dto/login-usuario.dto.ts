import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LoginUsuarioDto {

    @IsString({ message: 'El campo email es obligatorio y debe ser tipo texto' })    
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    email: string;

    @IsString({ message: 'El campo password es obligatorio y debe ser tipo texto' })
    @MinLength(6,{ message: 'la password debe tener más de 6 caracteres' })
    @MaxLength(50,{ message: 'la password debe tener menos de 50 caracteres' })
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe tener una letra mayúscula, minúscula y un número'
    })
    password: string;    
}
