import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateNewsDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  
  @IsNotEmpty()
  @IsString()
  annotation: string;

  @IsNotEmpty()
  @IsString()
  description: string;
  
  createdAt: Date;
  updatedAt: Date;

  @IsNotEmpty()
  category: Category;

  @IsOptional()
  user: User;
}
