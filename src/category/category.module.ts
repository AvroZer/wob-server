import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { News } from 'src/news/entities/news.entity';
import { NewsService } from 'src/news/news.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, News])],
  controllers: [CategoryController],
  providers: [CategoryService, NewsService],
})
export class CategoryModule {}
