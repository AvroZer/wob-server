import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('comment')
@ApiTags('Comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':newsId')
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req,
    @Param('newsId') newsId: string,
  ) {
    return this.commentService.create(
      createCommentDto,
      +req.user.id,
      +newsId,
    );
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard, )
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, )
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
