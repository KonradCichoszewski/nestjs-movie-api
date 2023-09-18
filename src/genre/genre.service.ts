import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { PrismaService } from 'src/shared/prisma.service';
import { GenreQueryDto } from './dto/genre.query.dto';
import { Genre } from '@prisma/client';
import { createFail, deleteFail, updateFail } from 'src/shared/messages';
import { SortingDirection } from 'src/shared/enums/sorting-direction.enum';

@Injectable()
export class GenreService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(GenreService.name);
  private readonly entityName = 'genre';

  async create(dto: CreateGenreDto): Promise<Genre> {
    // Check if genre with the same name already exists
    const exisintgGenre = await this.prisma.genre.findUnique({
      where: { name: dto.name },
    });

    // Throw ConflictException if genre already exists
    if (exisintgGenre) {
      throw new ConflictException(`Genre named "${dto.name}" already exists`);
    }

    // Create genre
    try {
      const genre = await this.prisma.genre.create({
        data: dto,
      });
      return genre;
    } catch (error) {
      // In case of unexpected error, log it and throw InternalServerErrorException
      this.logger.error(error);
      throw new InternalServerErrorException(createFail(this.entityName));
    }
  }

  async findAll(query: GenreQueryDto): Promise<Genre[]> {
    // Find all genres
    return this.prisma.genre.findMany({
      // Sort genres by name in ascending order by default
      orderBy: { ['name']: SortingDirection.ASC },
      // Include movies into result if includeMovies query parameter is true
      include: { movies: query.includeMovies },
    });
  }

  async findOneById(id: number, query: GenreQueryDto): Promise<Genre> {
    // Find genre by id
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      // Include movies into result if includeMovies query parameter is true
      include: { movies: query.includeMovies },
    });

    // Throw NotFoundException if genre with the specified id doesn't exist
    if (!genre) {
      throw new NotFoundException(`Genre with id ${id} not found`);
    }

    return genre;
  }

  async findOneByName(name: string): Promise<Genre> {
    // Find genre by name
    const genre = await this.prisma.genre.findUnique({
      where: { name },
    });

    // Throw NotFoundException if genre with the specified name doesn't exist
    if (!genre) {
      throw new NotFoundException(`Genre named "${name}" not found`);
    }

    return genre;
  }

  async update(
    id: number,
    updateGenreDto: UpdateGenreDto,
    query: GenreQueryDto,
  ): Promise<Genre> {
    try {
      // Update genre
      const updatedGenre = await this.prisma.genre.update({
        where: { id },
        data: updateGenreDto,
        // Include movies into result if includeMovies query parameter is true
        include: { movies: query.includeMovies },
      });
      return updatedGenre;
    } catch (error) {
      // In case of unexpected error, log it and throw InternalServerErrorException
      this.logger.error(error);
      throw new InternalServerErrorException(updateFail(this.entityName));
    }
  }

  async remove(id: number, query: GenreQueryDto): Promise<Genre> {
    try {
      // Delete genre
      const deletedGenre = await this.prisma.genre.delete({
        where: { id },
        // Include movies into result if includeMovies query parameter is true
        include: { movies: query.includeMovies },
      });
      return deletedGenre;
    } catch (error) {
      // In case of unexpected error, log it and throw InternalServerErrorException
      this.logger.error(error);
      throw new InternalServerErrorException(deleteFail(this.entityName));
    }
  }
}
