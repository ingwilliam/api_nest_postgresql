import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { MinioController } from './minio.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [MinioController],
  providers: [MinioService],
  imports: [ConfigModule]
})
export class MinioModule {}
