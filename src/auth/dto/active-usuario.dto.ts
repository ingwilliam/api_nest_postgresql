import { IsArray, IsEmail, IsJWT, IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from "class-validator";

export class ActiveUsuarioDto {
    @IsUUID()
    id: string;
}
