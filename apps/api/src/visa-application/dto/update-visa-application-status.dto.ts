import { IsEnum, IsNotEmpty } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { VisaApplicationStatus } from "../../generated/prisma/client"
import { VisaApplicationDto } from "./shared.dto"

export class UpdateVisaApplicationStatusRequestBodyDto {
  @ApiProperty({
    description: "New status for the visa application",
    enum: VisaApplicationStatus,
    example: VisaApplicationStatus.UNDER_REVIEW,
  })
  @IsEnum(VisaApplicationStatus)
  @IsNotEmpty()
  status!: VisaApplicationStatus
}

export class UpdateVisaApplicationStatusSuccessResponseDto {
  @ApiProperty({ description: "Updated visa application", type: VisaApplicationDto })
  data: VisaApplicationDto
}
