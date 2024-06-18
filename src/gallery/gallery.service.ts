import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gallery } from './entities/gallery.entity';
import { Repository } from 'typeorm';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { deleteFile } from './storage';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,
  ) {}

  async create(CreateGalleryDto: CreateGalleryDto, file: Express.Multer.File) {
    const addGallery = {
      title: CreateGalleryDto.title,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };

    if (!CreateGalleryDto.title)
      throw new BadRequestException('Введите название');
    if (!file || !file.filename)
      throw new BadRequestException('Добавьте фотографию');

    return await this.galleryRepository.save(addGallery);
  }

  async findAll() {
    const gallery = await this.galleryRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
    return gallery;
  }

  async findOne(id: number) {
    const gallery = await this.galleryRepository.findOne({
      where: { id },
    });

    if (!gallery) throw new NotFoundException('Фотография не найдена');

    return gallery;
  }

  async remove(id: number) {
    const gallery = await this.galleryRepository.findOne({
      where: { id },
    });

    if (!gallery) throw new NotFoundException('Фотография не найдена');

    deleteFile(`./gallery/${gallery.filename}`);

    return await this.galleryRepository.delete(id);
  }
}
