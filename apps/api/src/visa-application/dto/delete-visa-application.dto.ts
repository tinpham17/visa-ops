import { ApiProperty } from "@nestjs/swagger"
import { VisaApplicationDto } from "./shared.dto"

export class DeleteVisaApplicationSuccessResponseDto {
  @ApiProperty({ description: "Deleted visa application", type: VisaApplicationDto })
  data: VisaApplicationDto
}
