import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagsCriteria, TagsService } from './tags.service';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TagsDto } from './dto/tags.dto';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
    constructor(
        private tagsService: TagsService
    ){}

    @ApiOperation({summary: 'Creating a tag'})
    @Post()
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    createTag(@Body() dto: TagsDto){
        return this.tagsService.createTag(dto);
    }

    @ApiOperation({summary: 'Get all tags'})
    @Get()
    getAllTags(
        @Query('limit') limit: string = '10',
        @Query('page') page: string = '1',
        @Query('searchTag') searchTag: string = '',
        @Query('tagsCriteria') tagsCriteria: TagsCriteria = TagsCriteria.New
    ){
        return this.tagsService.getAllTags(
            limit, 
            page, 
            searchTag,
            tagsCriteria
        )
    }
}
