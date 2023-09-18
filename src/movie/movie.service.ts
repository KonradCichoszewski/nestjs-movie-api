import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from 'src/shared/prisma.service';
import { GetMoviesQueryDto, MoviesSortBy } from './dto/get-movies.query.dto';
import { Movie, Prisma } from '@prisma/client';
import { GenreService } from 'src/genre/genre.service';
import { createFail, deleteFail, updateFail } from 'src/shared/messages';
import { PaginationMetadataDto } from 'src/shared/dto/pagination-metadata.dto';
import { GetMoviesPaginatedResponseDto } from './dto/get-movies-paginated.response.dto';
import { SortingDirection } from 'src/shared/enums/sorting-direction.enum';
import { SearchMoviesQueryDto } from './dto/search-movies.query.dto';

@Injectable()
export class MovieService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly genreService: GenreService,
  ) {}
  private readonly logger = new Logger(MovieService.name);
  private readonly entityName = 'movie';

  async create(dto: CreateMovieDto): Promise<Movie> {
    // Check if all provided genres exist, if not throw NotFoundException
    await Promise.all(
      dto.genres.map(async (name) => {
        return this.genreService.findOneByName(name);
      }),
    );

    try {
      // Create movie
      const movie = await this.prisma.movie.create({
        data: {
          title: dto.title,
          description: dto.description,
          releaseDate: dto.releaseDate,
          genres: {
            connect: dto.genres.map((name) => ({ name })),
          },
        },
        // Include genres into result
        include: { genres: true },
      });
      return movie;
    } catch (error) {
      // In case of unexpected error, log it and throw InternalServerErrorException
      this.logger.error(error);
      throw new InternalServerErrorException(createFail(this.entityName));
    }
  }

  async findAll(
    dto: GetMoviesQueryDto,
  ): Promise<GetMoviesPaginatedResponseDto> {
    // Map the query object
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

    // Get a total count of movies that match the query and the movies themselves
    const [totalCount, items] = await this.prisma.$transaction([
      this.prisma.movie.count({
        where: query,
      }),
      this.prisma.movie.findMany({
        where: query,
        orderBy: [
          { [dto.sortBy]: dto.sortingDirection },
          { [MoviesSortBy.ID]: SortingDirection.ASC },
        ],
        skip: (dto.page - 1) * dto.pageSize,
        take: dto.pageSize,
        include: { genres: true },
      }),
    ]);

    // Map pagination metadata
    const pagination: PaginationMetadataDto = {
      page: dto.page,
      pageSize: dto.pageSize,
      totalCount,
    };

    // Map the response object
    const result: GetMoviesPaginatedResponseDto = { items, pagination };

    return result;
  }

  async findOne(id: number): Promise<Movie> {
    // Find movie by id
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      // Include genres into result
      include: { genres: true },
    });

    // Throw NotFoundException if movie with the specified id doesn't exist
    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }

    return movie;
  }

  async search(
    dto: SearchMoviesQueryDto,
  ): Promise<GetMoviesPaginatedResponseDto> {
    // Map the query object
    const query: Prisma.MovieWhereInput = {
      OR: [
        { title: { contains: dto.titleOrGenre, mode: 'insensitive' } },
        {
          genres: {
            some: { name: { contains: dto.titleOrGenre, mode: 'insensitive' } },
          },
        },
      ],
    };

    // Get a total count of movies that match the query and the movies themselves
    const [totalCount, items] = await this.prisma.$transaction([
      this.prisma.movie.count({
        where: query,
      }),
      this.prisma.movie.findMany({
        where: query,
        // Sort the results
        orderBy: [
          { [dto.sortBy]: dto.sortingDirection },
          { [MoviesSortBy.ID]: SortingDirection.ASC },
        ],
        // Skip and take are used for pagination
        skip: (dto.page - 1) * dto.pageSize,
        take: dto.pageSize,
        // Include genres into result
        include: { genres: true },
      }),
    ]);

    // Map pagination metadata
    const pagination: PaginationMetadataDto = {
      page: dto.page,
      pageSize: dto.pageSize,
      totalCount,
    };

    // Map the response object
    const result: GetMoviesPaginatedResponseDto = { items, pagination };

    return result;
  }

  async update(id: number, dto: UpdateMovieDto): Promise<Movie> {
    // Check if all provided genres exist, if not throw NotFoundException
    await Promise.all([
      ...(dto.genresToAdd === undefined
        ? []
        : dto.genresToAdd?.map(async (name) => {
            return this.genreService.findOneByName(name);
          })),
      ...(dto.genresToRemove == undefined
        ? []
        : dto.genresToRemove?.map(async (name) => {
            return this.genreService.findOneByName(name);
          })),
    ]);

    try {
      // Update movie
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
        // Include genres into result
        include: { genres: true },
      });
      return updatedMovie;
    } catch (error) {
      // In case of unexpected error, log it and throw InternalServerErrorException
      this.logger.error(error);
      throw new InternalServerErrorException(updateFail(this.entityName));
    }
  }

  async remove(id: number): Promise<Movie> {
    // Delete movie
    try {
      const deletedMovie = await this.prisma.movie.delete({
        where: { id },
        // Include genres into result
        include: { genres: true },
      });
      return deletedMovie;
    } catch (error) {
      // In case of unexpected error, log it and throw InternalServerErrorException
      this.logger.error(error);
      throw new InternalServerErrorException(deleteFail(this.entityName));
    }
  }
}
