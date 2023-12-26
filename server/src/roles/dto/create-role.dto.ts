import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateRoleDto {
    @ApiProperty({example: 'ADMIN', description: 'Role value'})
    @IsString()
    readonly value: string;
    
    @ApiProperty({example: 'Admninistrator', description: 'Role description'})
    @IsString()
    readonly description: string;
}