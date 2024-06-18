import { IsNotEmpty } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateCommentDto {
  @IsNotEmpty()
  text: string;

  createdAt: Date;
  updatedAt: Date;

  @IsNotEmpty()
  user: User;
}
