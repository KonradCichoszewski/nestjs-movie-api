import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { PrismaService } from 'src/shared/prisma.service';

@Module({
  controllers: [GenreController],
  providers: [GenreService, PrismaService],
  exports: [GenreService],
})
export class GenreModule {}
