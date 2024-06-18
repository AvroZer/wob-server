import { Comment } from 'src/comment/entities/comment.entity';
import { News } from 'src/news/entities/news.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => News, (news) => news.user)
  news: News[];

  @OneToMany(() => Comment, (comment) => comment.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comment: Comment[];
}
