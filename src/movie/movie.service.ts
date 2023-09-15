import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from 'src/shared/prisma.service';
import { GetMoviesQueryDto } from './dto/get-movies.query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MovieService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMovieDto) {
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
      throw new BadRequestException('Failed to create movie');
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
      throw new BadRequestException('Failed to update movie');
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
      throw new BadRequestException('Failed to delete movie');
    }
  }
}
