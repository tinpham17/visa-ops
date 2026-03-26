import { ApiProperty } from "@nestjs/swagger"

export class NoteDto {
  @ApiProperty({ description: "Note ID" })
  id: string

  @ApiProperty({ description: "Name of the person who added the note" })
  author: string

  @ApiProperty({ description: "Content of the note" })
  content: string

  @ApiProperty({ description: "When the note was created" })
  createdAt: string
}

export class VisaApplicationDto {
  @ApiProperty({ description: "Visa application ID" })
  id: string

  @ApiProperty({ description: "Full name of the applicant" })
  applicantName: string

  @ApiProperty({ description: "Email address of the applicant" })
  email: string

  @ApiProperty({ description: "Nationality of the applicant" })
  nationality: string

  @ApiProperty({ description: "Destination country for visa application" })
  destinationCountry: string

  @ApiProperty({ description: "Type of visa being applied for" })
  visaType: string

  @ApiProperty({ description: "Planned travel date" })
  travelDate: string

  @ApiProperty({
    description: "Current status of the visa application",
    enum: ["SUBMITTED", "UNDER_REVIEW", "DOCS_REQUIRED", "APPROVED", "REJECTED"],
  })
  status: string

  @ApiProperty({ description: "When the application was created" })
  createdAt: string

  @ApiProperty({ description: "When the application was last updated" })
  updatedAt: string

  @ApiProperty({
    description: "Notes associated with this application",
    type: [NoteDto],
    required: false,
  })
  notes?: NoteDto[]
}
