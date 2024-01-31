import { Controller, Post, UseGuards, Get, Body, UploadedFile, Req, UseInterceptors, Request, Param, Delete, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderCriteria, QuestionService } from './question.service';
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
    @ApiResponse({status: 200, type: Question})
    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    createQuestion(
        @Body() dto: CreateQuestionDto,
        @UploadedFile() image: any,
        @Req() req: any
    ): Promise<Question>{
        const userId = req.user.id;
        return this.questionService.createQuestion(dto, image, userId,
            //dto.tagIds
        )
    }

    @ApiOperation({summary: 'Get all questions'})
    @ApiResponse({status: 200, type: [Question]})
    @Get()
    getAllQuestions(
        @Query('limit') limit: string = '15',
        @Query('page') page: string = '1',
        @Query('searchQuestion') searchQuestion: string = '',
        @Query('orderCriteria') orderCriteria: OrderCriteria = OrderCriteria.Newest
    ) {
        return this.questionService.getAllQuestions(limit, page, searchQuestion, orderCriteria)
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

    @ApiOperation({summary: "Increase views by one"})
    @Put('/views')
    increaseViews(@Body() data: { id: string }){
        const questionId = data.id;
        return this.questionService.increaseViews(+questionId)
    }
    
}
