import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FilesService } from 'src/files/files.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Question } from './models/question.model';
import OpenAI from 'openai';
import { User } from 'src/users/models/users.model';
import { Sequelize, WhereOptions } from 'sequelize';
import { Answer } from './answer/models/answer.model';
import { Op } from 'sequelize';
import { Tags } from 'src/tags/models/tags.model';

export enum OrderCriteria {
    Newest = 'Newest',
    Views = 'Views',
    Unanswered = 'Unanswered'
}

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
        @InjectModel(Tags) private tagsRepository: typeof Tags,
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


    async createQuestion(
        dto: CreateQuestionDto, 
        image: any, 
        userId: number,
        tagIds: number[]
    ) {
        delete dto.tagIds;
        let fileName = null;
        if (tagIds.length > 5) {
            throw new BadRequestException('More than 5 tags sent')
        }
        if (image){
            fileName = await this.fileService.createFile(image);
        }

        const question =  await this.questionRepository.create({
            ...dto,
            image: fileName,
            userId: userId
        } as any);

        if (tagIds && tagIds.length > 0) {
            const existingTags = await this.tagsRepository.findAll({
                where: {
                    id: tagIds
                }
            })

            if(existingTags.length !== tagIds.length) {
                throw new NotFoundException('One or more tags not found');
            }
            await question.$add('tags', tagIds);
        } else {
            throw new BadRequestException('TagsIds are required')
        }

        // const prompt = `${dto.title}. ${dto.fullDescription}`;
        // const gptAnswer = await this.chatWithGPt(prompt);
        // question.gptAnswer = gptAnswer;
        // await question.save();
        return question;
    }


    async getAllQuestions(
        limit: string, 
        page: string, 
        searchQuestion: string, 
        orderCriteria: OrderCriteria,
        //tagsIds?: number[] 
    ) : Promise<any> {
        const pageSize = parseInt(limit, 10) || 15;
        const currentPage = parseInt(page, 10) || 1;

        let order: [string, 'ASC' | 'DESC'][] = [['id', 'DESC']];

        switch (orderCriteria) {
            case OrderCriteria.Views:
                order = [['views', 'DESC'], ['id', 'DESC']];
                break;
            case OrderCriteria.Unanswered:
                order = [['id', 'DESC']];
                break;
            default:
                order = [['id', 'DESC']];
                break;
        }
        

        let whereCondition: WhereOptions<any> = {
            [Op.or]: [
                { title: { [Op.iLike]: `%${searchQuestion}%` } },
                { fullDescription: { [Op.iLike]: `%${searchQuestion}%` } },
            ],
        };

        if (orderCriteria === OrderCriteria.Unanswered) {
            whereCondition = {
                ...whereCondition,
                id: Sequelize.literal(`
                    NOT EXISTS (
                        SELECT 1
                        FROM "answer" AS "answers"
                        WHERE "answers"."questionId" = "Question"."id"
                    )
                `)
            };
        }

        const questions = await this.questionRepository.findAll({
            order,
            limit: pageSize,
            offset: (currentPage - 1) * pageSize, 
            where: whereCondition,
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
                    model: Tags,
                    attributes: ['id', 'tag'], 
                    through: { attributes: [] }
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
                    [
                        Sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM "answer" AS "answers"
                            WHERE "answers"."questionId" = "Question"."id"
                        )`),
                        'answersCount',
                    ],
                ]
            },
        });

        const totalCount = await this.questionRepository.count({
            where: whereCondition
        });
        return {rows: questions, count: totalCount};
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
                    model: Tags,
                    attributes: ['id', 'tag'], 
                    through: { attributes: [] }
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

    async increaseViews(questionId: number){
        const question = await this.questionRepository.findByPk(questionId)
        if(!question){
            throw new NotFoundException("Question not found");
        }
        question.views += 1;
        await question.save();
        return question;
    }
}
