import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from 'src/shared/prisma.service';
import { GetMoviesQueryDto } from './dto/get-movies.query.dto';
import { Prisma } from '@prisma/client';
import { GenreService } from 'src/genre/genre.service';
import { createFail, deleteFail, updateFail } from 'src/shared/messages';

@Injectable()
export class MovieService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly genreService: GenreService,
  ) {}
  private readonly logger = new Logger(MovieService.name);
  private readonly entityName = 'movie';

  async create(dto: CreateMovieDto) {
    await Promise.all(
      dto.genres.map(async (name) => {
        return this.genreService.findOneByName(name);
      }),
    );

    try {
      const movie = await this.prisma.movie.create({
        data: {
          title: dto.title,
          description: dto.description,
          releaseDate: dto.releaseDate,
          genres: {
            connect: dto.genres.map((name) => ({ name })),
          },
        },
        include: { genres: true },
      });
      return movie;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(createFail(this.entityName));
    }
  }

  async findAll(dto: GetMoviesQueryDto) {
    const query: Prisma.MovieWhereInput = {
      ...(dto.title !== undefined && {
        title: { contains: dto.title, mode: 'insensitive' },
      }),
      ...(dto.genre !== undefined && {
        genres: {
          some: { name: { contains: dto.genre, mode: 'insensitive' } },
        },
      }),
    };

    return this.prisma.movie.findMany({
      where: query,
      include: { genres: true },
    });
  }

  async findOne(id: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: { genres: true },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }

    return movie;
  }

  async update(id: number, dto: UpdateMovieDto) {
    await Promise.all([
      ...dto.genresToAdd.map(async (name) => {
        return this.genreService.findOneByName(name);
      }),
      ...dto.genresToRemove.map(async (name) => {
        return this.genreService.findOneByName(name);
      }),
    ]);

    try {
      const updatedMovie = await this.prisma.movie.update({
        where: { id },
        data: {
          title: dto.title,
          description: dto.description,
          releaseDate: dto.releaseDate,
          genres: {
            connect: dto.genresToAdd?.map((name) => ({ name })),
            disconnect: dto.genresToRemove?.map((name) => ({ name })),
          },
        },
        include: { genres: true },
      });
      return updatedMovie;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(updateFail(this.entityName));
    }
  }

  async remove(id: number) {
    try {
      const deletedMovie = await this.prisma.movie.delete({
        where: { id },
        include: { genres: true },
      });
      return deletedMovie;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(deleteFail(this.entityName));
    }
  }
}
