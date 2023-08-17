import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [CloudinaryController],
  providers: [CloudinaryService],
  exports:[CloudinaryService],
  imports: [ConfigModule]
})
export class CloudinaryModule {}
