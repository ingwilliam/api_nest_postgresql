import { TypeOrmModuleOptions } from "@nestjs/typeorm"

export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev',
    port: process.env.PORT || 3001,
    defaultLimit: process.env.DEFAULT_LIMIT || 10,
    stage: process.env.STAGE || 'dev',
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