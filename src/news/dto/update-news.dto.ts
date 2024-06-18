import { PartialType } from '@nestjs/mapped-types';
import { CreateNewsDto } from './create-news.dto';
import { Category } from 'src/category/entities/category.entity';

export class UpdateNewsDto extends PartialType(CreateNewsDto) {
    title?: string;
    annotation?: string;
    category?: Category;
    description?: string;
    updatedAt?: Date;
}
