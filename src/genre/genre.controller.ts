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

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post()
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genreService.create(createGenreDto);
  }

  @Get()
  findAll(@Query() query: GenreQueryDto) {
    return this.genreService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query() query: GenreQueryDto) {
    return this.genreService.findOne(+id, query);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGenreDto: UpdateGenreDto,
    @Query() query: GenreQueryDto,
  ) {
    return this.genreService.update(+id, updateGenreDto, query);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query() query: GenreQueryDto) {
    return this.genreService.remove(+id, query);
  }
}
