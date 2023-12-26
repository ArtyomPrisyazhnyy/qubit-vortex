import { Controller, Post, UseGuards, Get, Body, UploadedFile, Req, UseInterceptors, Request, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QuestionService } from './question.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Question } from './models/question.model';
import { CreateQuestionDto } from './dto/create-question.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags("Question")
@Controller('question')
export class QuestionController {
    
    constructor(
        private questionService: QuestionService
    ){ }

    @ApiOperation({summary: 'Creating a question'})
    @ApiResponse({status: 200, type: [Question]})
    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    createQuestion(
        @Body() dto: CreateQuestionDto,
        @UploadedFile() image: any,
        @Req() req: any
    ){
        const userId = req.user.id;
        return this.questionService.createQuestion(dto, image, userId)
    }

    @ApiOperation({summary: 'Get all questions'})
    @ApiResponse({status: 200, type: [Question]})
    @Get()
    getAllQuestions(@Request() req: any) {
        return this.questionService.getAllQuestions(req)
    }
    
    @ApiOperation({summary: 'Get one question'})
    @ApiResponse({status: 200, type: [Question]})
    @Get(':id')
    getOneQuestion(@Param('id') id: number){
        return this.questionService.getOneQuestion(id);
    }

    @ApiOperation({summary: 'Delete one question'})
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteOneQuestion(@Param('id') id: number){
        return this.questionService.removeOneQuestion(id)
    }
    
}
