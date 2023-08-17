import { CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Usuario } from '../../../usuarios/entities';
import { META_ROLES } from '../../decorators/role-protected.decorator';

@Injectable()
export class UsuarioRolGuard implements CanActivate {

  constructor(
    private readonly reflector:Reflector
  ){

  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {


    const validRoles:string[]=this.reflector.get(META_ROLES,context.getHandler());

    if ( !validRoles ) return true;

    if ( validRoles.length === 0 ) return true;

    const req =context.switchToHttp().getRequest();
    const user = req.user as Usuario;

    if(!user)
    {
        throw new InternalServerErrorException('El usuario no existe en el request');
    }

    for (const usuarioRol of user.usuarioRoles) {
      if(validRoles.includes(usuarioRol.rol.rol))
      {
          return true
      }
    }
    
    throw new ForbiddenException('El usuario no cuenta con el rol');
      

  }
}
