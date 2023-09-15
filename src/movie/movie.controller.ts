import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { GetMoviesQueryDto } from './dto/get-movies.query.dto';
import { Movie } from '@prisma/client';
import { IntIdParamDto } from 'src/shared/dto/int-id-param.dto';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  async create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.movieService.create(createMovieDto);
  }

  @Get()
  async findAll(@Query() query: GetMoviesQueryDto): Promise<Movie[]> {
    return this.movieService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param() { id }: IntIdParamDto): Promise<Movie> {
    return this.movieService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param() { id }: IntIdParamDto,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    return this.movieService.update(id, updateMovieDto);
  }

  @Delete(':id')
  async remove(@Param() { id }: IntIdParamDto): Promise<Movie> {
    return this.movieService.remove(id);
  }
}
