import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  UseGuards,
  Body,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from './storage';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { AdminGuard } from 'src/guard/admin.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('gallery')
@ApiTags('Gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Roles(true)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fileStorage,
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
        title: {
          type: 'string',
        },
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
    @Body() title: CreateGalleryDto,
  ) {
    return this.galleryService.create(title, file);
  }

  @Get()
  findAll() {
    return this.galleryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.galleryService.findOne(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Roles(true)
  remove(@Param('id') id: string) {
    return this.galleryService.remove(+id);
  }
}
