import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { PrismaService } from 'src/shared/prisma.service';
import { GenreService } from 'src/genre/genre.service';

@Module({
  controllers: [MovieController],
  providers: [MovieService, PrismaService, GenreService],
})
export class MovieModule {}
