import { OrderCriteria } from './../question/question.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tags } from './models/tags.model';
import { TagsDto } from './dto/tags.dto';
import { Op, Sequelize, WhereOptions } from 'sequelize';

export enum TagsCriteria {
    Popular = 'Popular',
    Name = 'Name',
    New = 'New'
}

@Injectable()
export class TagsService {

    constructor(
        @InjectModel(Tags) private tagsRepository: typeof Tags
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
            tag: { [Op.iLike]: `%${searchTag}%` },
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
            }
        });

        return tags;
    }
}
