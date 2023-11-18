import { FileInterceptor } from '@nestjs/platform-express';
import { Controller, Post, UseInterceptors, UseGuards, Body, UploadedFile, Req, Get } from "@nestjs/common";
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
    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    createAnswer(
        @Body() dto: CreateAnswerDto,
        @UploadedFile() image: any,
        @Req() req: any
    ){
        const userId = req.user.id;
        return this.answerService.createAnswer(dto, image, userId)
    }

}
