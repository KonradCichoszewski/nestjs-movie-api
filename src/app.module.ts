import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MovieModule } from './movie/movie.module';
import { GenreModule } from './genre/genre.module';
import { RequestLogger } from './shared/middleware/request.logger';

@Module({
  imports: [ConfigModule.forRoot(), MovieModule, GenreModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLogger).forRoutes('*');
  }
}
