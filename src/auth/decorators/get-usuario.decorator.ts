import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";



export const GetUsuario = createParamDecorator((data:string,ctx:ExecutionContext)=>{

    const req =ctx.switchToHttp().getRequest();
    const user = req.user;

    if(!user)
    {
        throw new InternalServerErrorException('El usuario no existe en el request');
    }

    return (!data)?user:user[data];
});