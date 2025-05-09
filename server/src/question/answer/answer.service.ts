import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Answer } from "./models/answer.model";
import { FilesService } from "src/files/files.service";
import { CreateAnswerDto } from "./dto/create-asnwer.dto";

@Injectable()
export class AnswerService {
    constructor(
        @InjectModel(Answer) private answerRepository: typeof Answer,
        private fileService: FilesService
    ) {}

    async createAnswer (dto: CreateAnswerDto, image: any, userId: number, questionId: number){
        let fileName = null
        if (image) {
            fileName = await this.fileService.createFile(image);
        }

        const answer = await this.answerRepository.create({
            ...dto,
            image: fileName,
            userId: userId,
            questionId
        } as CreateAnswerDto)

        return answer;
    }

    async removeOneAnswer(id: number){
        const answer = await this.answerRepository.destroy({
            where: {id}
        });
        return answer;
    }
}