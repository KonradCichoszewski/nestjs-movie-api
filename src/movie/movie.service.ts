import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from 'src/shared/prisma.service';

@Injectable()
export class MovieService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateMovieDto) {
    return this.prisma.movie.create({
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
  }

  findAll() {
    return this.prisma.movie.findMany({
      include: { genres: true },
    });
  }

  findOne(id: number) {
    const movie = this.prisma.movie.findUnique({
      where: { id },
      include: { genres: true },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }

    return movie;
  }

  update(id: number, dto: UpdateMovieDto) {
    return this.prisma.movie.update({
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
  }

  remove(id: number) {
    return this.prisma.movie.delete({
      where: { id },
      include: { genres: true },
    });
  }
}
