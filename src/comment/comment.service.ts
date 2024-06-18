import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    userId: number,
    newsId: number,
  ) {
    const addComment = {
      text: createCommentDto.text,
      user: { id: userId },
      news: { id: newsId },
    };
    return this.commentRepository.save(addComment);
  }

  async findAll() {
    const commentData = await this.commentRepository.find({
      order: {
        createdAt: 'DESC',
      },
      relations: {
        user: true,
        news: true,
      },
    });
    const comment = commentData.map((commentData) => ({
      ...commentData,
      user: commentData.user.id,
      login: commentData.user.login,
    }));
    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: {
        user: true,
        news: true,
      },
    });

    if (!comment) throw new NotFoundException('Комментарий не найдена');
    return await this.commentRepository.update(id, updateCommentDto);
  }

  async remove(id: number) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: {
        user: true,
        news: true,
      },
    });

    if (!comment) throw new NotFoundException('Комментарий не найдена');

    return await this.commentRepository.delete(id);
  }
}
