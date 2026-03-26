import { IsEmail, IsNotEmpty, IsString, IsDateString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { VisaApplicationDto } from "./shared.dto"

export class CreateVisaApplicationRequestBodyDto {
  @ApiProperty({
    description: "Full name of the applicant",
    example: "John Doe",
  })
  @IsNotEmpty()
  @IsString()
  applicantName!: string

  @ApiProperty({
    description: "Email address of the applicant",
    example: "john.doe@example.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string

  @ApiProperty({
    description: "Nationality of the applicant",
    example: "Vietnam",
  })
  @IsNotEmpty()
  @IsString()
  nationality!: string

  @ApiProperty({
    description: "Destination country for visa application",
    example: "United States",
  })
  @IsNotEmpty()
  @IsString()
  destinationCountry!: string

  @ApiProperty({
    description: "Type of visa being applied for",
    example: "Tourist Visa",
  })
  @IsNotEmpty()
  @IsString()
  visaType!: string

  @ApiProperty({
    description: "Planned travel date",
    example: "2024-06-15",
  })
  @IsNotEmpty()
  @IsDateString()
  travelDate!: string
}

export class CreateVisaApplicationSuccessResponseDto {
  @ApiProperty({ description: "Created visa application", type: VisaApplicationDto })
  data: VisaApplicationDto
}
