import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let email = 'N/A';
    if(request.user)
    {
        email=request.user.email;
    }

    console.log({usuario:email,context:ValidationExceptionFilter.name,"description":"Se genera restricción en la petición","response":exception.getResponse()});            

    response.status(exception.getStatus()).json(exception.getResponse());
    
  }
}
