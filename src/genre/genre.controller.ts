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
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreQueryDto } from './dto/genre.query.dto';
import { Genre } from '@prisma/client';
import { IntIdParamDto } from 'src/shared/dto/int-id-param.dto';

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post()
  async create(@Body() createGenreDto: CreateGenreDto): Promise<Genre> {
    console.log(createGenreDto);
    return this.genreService.create(createGenreDto);
  }

  @Get()
  async findAll(@Query() query: GenreQueryDto): Promise<Genre[]> {
    return this.genreService.findAll(query);
  }

  @Get(':id')
  async findOne(
    @Param() { id }: IntIdParamDto,
    @Query() query: GenreQueryDto,
  ): Promise<Genre> {
    return this.genreService.findOne(id, query);
  }

  @Patch(':id')
  async update(
    @Param() { id }: IntIdParamDto,
    @Body() updateGenreDto: UpdateGenreDto,
    @Query() query: GenreQueryDto,
  ): Promise<Genre> {
    return this.genreService.update(id, updateGenreDto, query);
  }

  @Delete(':id')
  async remove(
    @Param() { id }: IntIdParamDto,
    @Query() query: GenreQueryDto,
  ): Promise<Genre> {
    return this.genreService.remove(id, query);
  }
}
