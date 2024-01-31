import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class TagsDto {
    @ApiProperty({example: 'Java', description: 'Tag value'})
    @IsString()
    readonly tag: string;
    
    @ApiProperty({example: 'Java is a high-level object-oriented programming language', description: 'Tag description'})
    @IsString()
    readonly description: string;
}