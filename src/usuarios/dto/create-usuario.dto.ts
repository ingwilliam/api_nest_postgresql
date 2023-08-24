import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEmail, IsIn, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUsuarioDto {

    @ApiProperty({
        description:'El correo del usuario con el cual se registra y se autentica',
        nullable:false,        
    })
    @IsString()    
    @IsEmail()
    email: string;

    @ApiProperty({
        description:'El password del usuario con el cual se registra y se autentica',
        nullable:false,
        minLength:6,
        maxLength:60
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe tener una letra mayúscula, minúscula y un número'
    })
    password: string;

    @ApiProperty({
        description:'El nombre completo del usuario',
        nullable:false,
        minLength:1,        
    })
    @IsString()
    @MinLength(1)
    nombreCompleto: string;

    @ApiProperty({
        description:'El usuario esta activo',        
        default:true
    })
    @IsBoolean()
    activo: boolean;

    @ApiProperty({
        description:'El usuario esta activo',        
        isArray:true,
        default:'BASICA',
        enum:['BASICA','GOOGLE','FACEBOOK']
    })
    @IsIn(['BASICA','GOOGLE','FACEBOOK'])    
    @IsOptional()
    autenticacion?: string;

    @ApiProperty({
        description:'El usuario esta activo',        
        isArray:true,                
        enum:['USER']
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    roles?: string[]
    
}
