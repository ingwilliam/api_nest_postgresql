import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { MinioController } from './minio.controller';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [MinioController],
  providers: [MinioService],
  exports:[MinioService],
  imports: [ConfigModule,CommonModule]
})
export class MinioModule {}
