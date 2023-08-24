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

    //Si quieren ajustar la forma de como responde nestjs, pueden tomar como ejemplo el siguiente codigo
    // if (exception.getStatus() === 400) {
    //     response.status(400).json({
    //         statusCode: 400,
    //         message: 'Validation failed',
    //         errors: exception.getResponse(),
    //       });
    // }
    // else
    // {
    // Puedes manejar otros tipos de excepciones aquí si es necesario
    // }
     
    
    
  }
}
