import { IsArray, IsEmail, IsJWT, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class RegistroUsuarioGoogleDto {
    @IsJWT()
    token: string;
}
