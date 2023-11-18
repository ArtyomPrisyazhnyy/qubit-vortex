import { Injectable } from '@nestjs/common';
import { FilesService } from 'src/files/files.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Question } from './models/question.model';
import OpenAI from 'openai';

@Injectable()
export class QuestionService {
    private openai: OpenAI;
    private conversationHistory: {
        role: "function" | "user" | "system" | "assistant";
        content: string;
        name: string;
    }[] = [];

    constructor(
        @InjectModel(Question) private questionRepository: typeof Question,
        private fileService: FilesService,
        
    ){
        this.openai = new OpenAI({
            apiKey: process.env.MARFUSHA 
        });
    }

    async chatWithGPt(content: string) {
        this.conversationHistory.push({
            role: 'user',
            content: content,
            name: 'user'
        });
        const chatCompletion = await this.openai.chat.completions.create({
            messages: [
                {role: "system", content: "you are a helful assiatant"},
                ...this.conversationHistory,
            ],
            model: "gpt-3.5-turbo-1106"
        });

        this.conversationHistory.push({
            role: "assistant",
            content: chatCompletion.choices[0].message.content,
            name: "assistant"
        });

        return chatCompletion.choices[0].message.content
    }


    async createQuestion(dto: CreateQuestionDto, image: any, userId: number) {
        let fileName = null
        if (image){
            fileName = await this.fileService.createFile(image);
        }
        
        const question =  await this.questionRepository.create({
            ...dto,
            image: fileName,
            userId: userId
        } as CreateQuestionDto);

        //const prompt = `${dto.title}. ${dto.fullDescription}`;
        // const gptAnswer = await this.chatWithGPt(prompt);
        // question.gptAnswer = gptAnswer;
        // await question.save();
        return question;
    }


    async getAllQuestions(req: any){
        let {limit} = req.query;
        limit = limit || 20;
        const questions = await this.questionRepository.findAndCountAll({
            include: {all: true},
            limit
        })
        return questions;
    }

    async getOneQuestion(id: number) {
        const question = await this.questionRepository.findOne({
            where: {id},
            include: {all: true}
        });
        return question;
    }

    async removeQuestion (id: string){
        const question = await this.questionRepository.destroy({
            where: {id}
        });
        return question
    }
}
