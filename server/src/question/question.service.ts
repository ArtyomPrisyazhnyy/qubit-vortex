import { Injectable } from '@nestjs/common';
import { FilesService } from 'src/files/files.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Question } from './models/question.model';
import OpenAI from 'openai';
import { User } from 'src/users/models/users.model';
import { Sequelize } from 'sequelize';
import { Answer } from './answer/models/answer.model';

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
            apiKey: process.env.OPENAI_API_KEY 
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

        // const prompt = `${dto.title}. ${dto.fullDescription}`;
        // const gptAnswer = await this.chatWithGPt(prompt);
        // question.gptAnswer = gptAnswer;
        // await question.save();
        return question;
    }


    async getAllQuestions(req: any){
        let {limit} = req.query;
        limit = limit || 20;
        const questions = await this.questionRepository.findAndCountAll({
            include: [
                {
                    model: User,
                    attributes: {
                        exclude: [
                            'email', 
                            'password', 
                            'createdAt', 
                            'updatedAt'
                        ]
                    }
                }
            ],
            attributes: {
                exclude: [
                    'gptAnswer', 
                    'image'
                ],
                include: [
                    [
                        Sequelize.literal(`CASE WHEN LENGTH("fullDescription") <= 200 THEN "fullDescription" ELSE CONCAT(SUBSTRING("fullDescription", 1, 200), '...') END`),
                        'fullDescription',
                      ],
                ]
            },
            limit
        })
        return questions;
    }

    async getOneQuestion(id: number) {
        const question = await this.questionRepository.findOne({
            where: {id},
            include: [
                {
                    model: User,
                    attributes: {
                        exclude: [
                            'email', 
                            'password', 
                            'createdAt', 
                            'updatedAt'
                        ]
                    }
                },
                {
                    model: Answer,
                    include: [
                        {
                            model: User,
                            attributes: {
                                exclude: [
                                    'email', 
                                    'password', 
                                    'createdAt', 
                                    'updatedAt'
                                ],
                            }
                        }
                    ]
                }
            ],
        });
        return question;
    }

    async removeOneQuestion (id: number){
        const question = await this.questionRepository.destroy({
            where: {id}
        });
        return question
    }
}
