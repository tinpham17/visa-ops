import { ApiProperty } from "@nestjs/swagger"
import { VisaApplicationDto } from "./shared.dto"

export class GetVisaApplicationSuccessResponseDto {
  @ApiProperty({ description: "Visa application details", type: VisaApplicationDto })
  data: VisaApplicationDto
}
