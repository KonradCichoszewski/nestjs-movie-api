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

  async findAll(
    dto: GetMoviesQueryDto,
  ): Promise<GetMoviesPaginatedResponseDto> {
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

    const pagination: PaginationMetadataDto = {
      page: dto.page,
      pageSize: dto.pageSize,
      totalCount,
    };
    const result: GetMoviesPaginatedResponseDto = { items, pagination };

    return result;
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: { genres: true },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }

    return movie;
  }

  async search(
    dto: SearchMoviesQueryDto,
  ): Promise<GetMoviesPaginatedResponseDto> {
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

    const pagination: PaginationMetadataDto = {
      page: dto.page,
      pageSize: dto.pageSize,
      totalCount,
    };
    const result: GetMoviesPaginatedResponseDto = { items, pagination };

    return result;
  }

  async update(id: number, dto: UpdateMovieDto): Promise<Movie> {
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

  async remove(id: number): Promise<Movie> {
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
