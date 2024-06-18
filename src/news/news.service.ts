import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { Repository } from 'typeorm';
import { deleteFile } from './storage';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
  ) {}

  async create(
    createNewsDto: CreateNewsDto,
    id: number,
    file: Express.Multer.File,
  ) {
    const addNews = {
      title: createNewsDto.title,

      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,

      annotation: createNewsDto.annotation,
      description: createNewsDto.description,
      user: { id },
      category: { id: +createNewsDto.category },
    };
    if (!addNews) throw new BadRequestException('Что-то пошло не так...');

    return await this.newsRepository.save(addNews);
  }

  async findAll() {
    const news = await this.newsRepository.find({
      order: {
        createdAt: 'DESC',
      },
      relations: {
        comment: true,
      },
    });

    return news;
  }

  async findOne(id: number) {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: {
        category: true,
        comment: {
          user: true,
        },
      },
    });

    if (!news) throw new NotFoundException('Новость не найдена');

    return news;
  }

  async update(id: number, updateNewsDto: UpdateNewsDto) {
    const news = await this.newsRepository.findOne({
      where: { id },
      // relations: {
      //   user: true,
      // },
    });

    if (!news) throw new NotFoundException('Новость не найдена');
    return await this.newsRepository.update(id, updateNewsDto);
  }

  async remove(id: number) {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: ['comment'],
    });

    if (!news) throw new NotFoundException('Новость не найдена');

    await this.newsRepository.remove(news);

    await deleteFile(`./news-images/${news.filename}`);
  }

  async findAllWithPagination(page: number, limit: number) {
    const news = await this.newsRepository.find({
      relations: {
        category: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return news;
  }
}
