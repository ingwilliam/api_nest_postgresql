import { PartialType } from '@nestjs/swagger';
import { CreateRepositorioDto } from './create-repositorio.dto';

export class UpdateRepositorioDto extends PartialType(CreateRepositorioDto) {}
