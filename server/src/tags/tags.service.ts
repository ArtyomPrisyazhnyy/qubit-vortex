import { OrderCriteria } from './../question/question.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tags } from './models/tags.model';
import { TagsDto } from './dto/tags.dto';
import { Op, Sequelize, WhereOptions } from 'sequelize';
import { Question } from 'src/question/models/question.model';

export enum TagsCriteria {
    Popular = 'Popular',
    Name = 'Name',
    New = 'New'
}

@Injectable()
export class TagsService {

    constructor(
        @InjectModel(Tags) private tagsRepository: typeof Tags,
        @InjectModel(Question) private questionsRepository: typeof Question
    ){}

    async createTag(dto: TagsDto){
        const tag = await this.tagsRepository.create(dto);
        return tag;
    }

    async getAllTags(
        limit: string, 
        page: string, 
        searchTag: string,
        tagsCritetia: TagsCriteria 
    ): Promise<any>{
        const pageSize = parseInt(limit, 10) || 10;
        const currentPage = parseInt(page, 10) || 1;

        const today = new Date(); // Текущая дата и время
        today.setHours(0, 0, 0, 0); // Установка времени на начало текущего дня
        const lastWeekDate = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
        const lastMonthDate = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

        let order: [string, 'ASC' | 'DESC'][] = [['id', 'DESC']];

        switch(tagsCritetia) {
            case TagsCriteria.New:
                order = [['id', 'DESC']];
                break;
            case TagsCriteria.Name:
                order = [['tag', 'ASC']];
                break;
            case TagsCriteria.Popular:
                order = [
                    [(Sequelize.literal('(SELECT COUNT(*) FROM question_tags WHERE "question_tags"."tagsId" = "Tags"."id")') as unknown) as string, 'DESC'],
                    ['id', 'ASC']
                ];
                break;
            default:
                order = [['id', 'DESC']];
        }

        const whereCondition: WhereOptions<any> = {
            tag: { [Op.iLike]: `${searchTag}%` },
        };

        const tags = await this.tagsRepository.findAll({
            order,
            limit: pageSize,
            offset: (currentPage - 1) * pageSize,
            where: whereCondition,
            attributes: {
                exclude: [
                    'createdAt',
                    'updatedAt'
                ],
                include: [[
                    Sequelize.literal(`CASE WHEN LENGTH("description") <= 180 THEN "description" ELSE CONCAT(SUBSTRING("description", 1, 180), '...') END`),
                    'description',
                ]]
            },
            
            include: [{
                model: Question,
                through: { attributes: [] }
            }]
        });

        const tagsWithQuestionCounts = await Promise.all(tags.map(async (tag: any) => {
            const todayCount = await this.questionsRepository.count({
                include: [{
                    model: Tags,
                    where: {
                        id: tag.id
                    }
                }],
                where: {
                    createdAt: { [Op.gte]: today } // Все вопросы, созданные после начала текущего дня
                }
            })
            const lastWeekCount = await this.questionsRepository.count({
                include: [{
                    model: Tags,
                    where: {
                        id: tag.id
                    }
                }],
                where: {
                    createdAt: { [Op.gte]: lastWeekDate }
                }
            });
        
            const lastMonthCount = await this.questionsRepository.count({
                include: [{
                    model: Tags,
                    where: {
                        id: tag.id
                    }
                }],
                where: {
                    createdAt: { [Op.gte]: lastMonthDate }
                }
            });
        
            return {
                id: tag.id,
                tag: tag.tag,
                description: tag.description,
                questionCount: tag.questions.length,
                todayQuestionCount: todayCount,
                lastWeekQuestionCount: lastWeekCount,
                lastMonthQuestionCount: lastMonthCount
            };
        }));

        const tagsCount = await this.tagsRepository.count({
            where: whereCondition
        });
    
        return {count: tagsCount, rows: tagsWithQuestionCounts};
    }
}
