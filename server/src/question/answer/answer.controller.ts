import { FileInterceptor } from '@nestjs/platform-express';
import { Controller, Post, UseInterceptors, UseGuards, Body, UploadedFile, Req, Get, Param, Delete } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AnswerService } from "./answer.service";
import { Answer } from "./models/answer.model";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CreateAnswerDto } from './dto/create-asnwer.dto';

@ApiTags("Answer")
@Controller("answer")
export class AnswerController{

    constructor(
        private answerService: AnswerService
    ) {}

    @ApiOperation({summary: 'Create an answer'})
    @ApiResponse({status: 200, type: [Answer]})
    @Post(':id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    createAnswer(
        @Body() dto: CreateAnswerDto,
        @UploadedFile() image: any,
        @Req() req: any,
        @Param('id') questionId: number
    ){
        const userId = req.user.id;
        return this.answerService.createAnswer(dto, image, userId, questionId)
    }

    @ApiOperation({summary: 'Delete one question'})
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteOneAnswer(@Param('id') id: number){
        return this.answerService.removeOneAnswer(id)
    }

}
