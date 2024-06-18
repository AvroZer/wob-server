import { Category } from 'src/category/entities/category.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  annotation: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  size: number;

  @Column()
  mimetype: string;

  @ManyToOne(() => User, (user) => user.news, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.news, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comment: Comment[];

  @ManyToOne(() => Category, (category) => category.news)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
