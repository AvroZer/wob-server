import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { NewsService } from './news.service';
import { Category } from 'src/category/entities/category.entity';
import { CategoryService } from 'src/category/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([News, Category])],
  controllers: [NewsController],
  providers: [NewsService, CategoryService],
})
export class NewsModule {}
