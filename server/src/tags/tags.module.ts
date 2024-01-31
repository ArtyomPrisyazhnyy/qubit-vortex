import { Module, forwardRef } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tags } from './models/tags.model';
import { Question } from 'src/question/models/question.model';
import { QuestionTags } from './models/question-tags.model';
import { RolesModule } from 'src/roles/roles.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    providers: [TagsService],
    controllers: [TagsController],
    imports: [
        SequelizeModule.forFeature([
            Tags,
            Question,
            QuestionTags
        ]),
        forwardRef(() => AuthModule)
    ]
})
export class TagsModule {}
