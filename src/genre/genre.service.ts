import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { PrismaService } from 'src/shared/prisma.service';
import { GenreQueryDto } from './dto/genre.query.dto';
import { Genre } from '@prisma/client';

@Injectable()
export class GenreService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGenreDto): Promise<Genre> {
    return this.prisma.genre.create({
      data: dto,
    });
  }

  async findAll(query: GenreQueryDto): Promise<Genre[]> {
    return this.prisma.genre.findMany({
      include: { movies: query.includeMovies },
    });
  }

  async findOne(id: number, query: GenreQueryDto): Promise<Genre> {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: { movies: query.includeMovies },
    });

    if (!genre) {
      throw new NotFoundException(`Genre with id ${id} not found`);
    }

    return genre;
  }

  async update(
    id: number,
    updateGenreDto: UpdateGenreDto,
    query: GenreQueryDto,
  ): Promise<Genre> {
    return this.prisma.genre.update({
      where: { id },
      data: updateGenreDto,
      include: { movies: query.includeMovies },
    });
  }

  async remove(id: number, query: GenreQueryDto): Promise<Genre> {
    return this.prisma.genre.delete({
      where: { id },
      include: { movies: query.includeMovies },
    });
  }
}
