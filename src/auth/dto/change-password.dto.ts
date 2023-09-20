import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class ChangePasswordDto {

    @IsString({ message: 'El campo email es obligatorio y debe ser tipo texto' })    
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    email: string;    

}
