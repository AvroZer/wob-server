import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  Query,
  UseInterceptors,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { newsImageStorage } from './storage';
import { Roles } from 'src/decorators/roles.decorator';
import { AdminGuard } from 'src/guard/admin.guard';

@Controller('news')
@ApiTags('News')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Roles(true)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: newsImageStorage,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        // title: {
        //   type: 'string',
        // },
        // annotation: {
        //   type: 'string',
        // },
        // description: {
        //   type: 'string',
        // },
        // category: {
        //   type: 'string',
        // },
      },
    },
  })
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })],
      }),
    )
    file: Express.Multer.File,
    @Body() createNewsDto: CreateNewsDto,
    @Req() req,
  ) {
    return this.newsService.create(createNewsDto, +req.user.id, file);
  }

  @Get('pagination')
  findAllWithPagination(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return this.newsService.findAllWithPagination(+page, +limit);
  }

  @Get()
  findAll() {
    return this.newsService.findAll();
  }

  // @Get()
  // async findAll() {
  //   const news = await this.newsService.findAll();
  //   const modifiedNews = news.map((item) => {
  //     return {
  //       ...item,
  //       imageUrl: `${process.env.BASE_URL}/news/${item.filename}`,
  //     };
  //   });
  //   return modifiedNews;
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(+id, updateNewsDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}
