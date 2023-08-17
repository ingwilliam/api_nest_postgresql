import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Usuario } from "src/usuarios/entities";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ){
    
    constructor(
        @InjectRepository(Usuario)
        private readonly userRepository: Repository<Usuario>,
        configService:ConfigService
    ){
        super({
            secretOrKey:configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload:JwtPayload):Promise<Usuario>{
        
        const {email,id} = payload;

        const user = await this.userRepository
        .createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.usuarioRoles', 'usuarioRoles')         
        .leftJoinAndSelect('usuarioRoles.rol', 'rolUsuarios')         
        .where('usuario.id = :id', { id })
        .getOne();

        if(!user)
        {
            throw new UnauthorizedException('Token no valido')
        }

        if(!user.activo)
        {
            throw new UnauthorizedException('El usuario no esta activo')
        }
        
        //console.log(user);

        return user;
    }

}
