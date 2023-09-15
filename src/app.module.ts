import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MovieModule } from './movie/movie.module';
import { GenreModule } from './genre/genre.module';

@Module({
  imports: [ConfigModule.forRoot(), MovieModule, GenreModule],
})
export class AppModule {}
