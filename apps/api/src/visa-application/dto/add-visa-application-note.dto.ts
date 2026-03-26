import { IsNotEmpty, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { NoteDto } from "./shared.dto"

export class AddVisaApplicationNoteRequestBodyDto {
  @ApiProperty({
    description: "Name of the person adding the note",
    example: "Officer Smith",
  })
  @IsNotEmpty()
  @IsString()
  author!: string

  @ApiProperty({
    description: "Content of the note",
    example: "Additional documents required for verification.",
  })
  @IsNotEmpty()
  @IsString()
  content!: string
}

export class AddVisaApplicationNoteSuccessResponseDto {
  @ApiProperty({ description: "Added note", type: NoteDto })
  data: NoteDto
}
