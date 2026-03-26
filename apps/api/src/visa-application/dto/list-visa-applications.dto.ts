import { IsOptional, IsString, IsEnum } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { VisaApplicationStatus } from "../../generated/prisma/client"
import { VisaApplicationDto } from "./shared.dto"

export class ListVisaApplicationsRequestQueryDto {
  @ApiProperty({
    description: "Search term to filter applications by name or email",
    example: "John",
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string

  @ApiProperty({
    description: "Filter by visa application status",
    enum: VisaApplicationStatus,
    required: false,
    example: VisaApplicationStatus.UNDER_REVIEW,
  })
  @IsOptional()
  @IsEnum(VisaApplicationStatus)
  status?: VisaApplicationStatus

  @ApiProperty({
    description: "Page number for pagination",
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1

  @ApiProperty({
    description: "Number of items per page",
    example: 10,
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10
}

export class ListVisaApplicationsSuccessResponseDto {
  @ApiProperty({ description: "Array of visa applications", type: [VisaApplicationDto] })
  data: VisaApplicationDto[]

  @ApiProperty({ description: "Total number of applications" })
  total: number

  @ApiProperty({ description: "Current page number" })
  page: number

  @ApiProperty({ description: "Number of items per page" })
  limit: number

  @ApiProperty({ description: "Total number of pages" })
  totalPages: number
}
