
import { DocumentBuilder } from "@nestjs/swagger";
import { TypeOrmModuleOptions } from "@nestjs/typeorm"


export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev',
    port: process.env.PORT || 3001,
    defaultLimit: process.env.DEFAULT_LIMIT || 10,
    stage: process.env.STAGE || 'dev',
    correlationId: process.env.CORRELATION_ID || 'x-correlation-id',
})

export const ConexionDB = (): TypeOrmModuleOptions => (
    {
        ssl: EnvConfiguration().stage === 'prod' ? true : false,
        extra: {
            ssl: EnvConfiguration().stage === 'prod'
                ? { rejectUnauthorized: false }
                : null
        },
        type: 'postgres',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        autoLoadEntities: true,
        synchronize: true
    }
);

export const ConfigDocumentBuilder = new DocumentBuilder()
    .setTitle('Teslo RESTFull API')
    .setDescription('Teslo shop endpoints')
    .setVersion('1.0')
    .addBearerAuth(
        {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token',
            in: 'header',
        },
        'JWT-auth',)
    .build();


    
// export const logFilePath = 'logs'; // Ruta relativa a la carpeta raíz de tu proyecto
// export const getCurrentDate = () => format(new Date(), 'yyyy-MM-dd'); // Formatea la fecha

// export const ConfingLoggerModule = (): Params => (
//     {
//         pinoHttp: {
//             transport: EnvConfiguration().environment === 'prod' ? {
//                 target: 'pino/file',
//                 options: {
//                     destination: `${logFilePath}/app-${getCurrentDate()}.log`,
//                     messageKey: 'message',
//                     singleLine: true,
//                 }
//             } :
//                 {
//                     target: 'pino-pretty',
//                     options: {                        
//                         messageKey: 'message',
//                         singleLine: true,
//                     }
//                 },
//             messageKey: 'message',
//             customProps: (req: any) => {
//                 return {
//                     correlation: req[EnvConfiguration().correlationId]
//                 };
//             },
//             autoLogging: false,                         
//         },
//     });   
     