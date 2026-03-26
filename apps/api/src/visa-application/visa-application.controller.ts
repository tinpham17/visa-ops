import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from "@nestjs/swagger"
import { VisaApplicationService } from "./visa-application.service"
import {
  CreateVisaApplicationRequestBodyDto,
  CreateVisaApplicationSuccessResponseDto,
} from "./dto/create-visa-application.dto"
import {
  UpdateVisaApplicationStatusRequestBodyDto,
  UpdateVisaApplicationStatusSuccessResponseDto,
} from "./dto/update-visa-application-status.dto"
import {
  AddVisaApplicationNoteRequestBodyDto,
  AddVisaApplicationNoteSuccessResponseDto,
} from "./dto/add-visa-application-note.dto"
import { DeleteVisaApplicationSuccessResponseDto } from "./dto/delete-visa-application.dto"
import {
  ListVisaApplicationsRequestQueryDto,
  ListVisaApplicationsSuccessResponseDto,
} from "./dto/list-visa-applications.dto"
import { GetVisaApplicationSuccessResponseDto } from "./dto/get-visa-application.dto"

@ApiTags("visa-applications")
@Controller("visa-applications")
export class VisaApplicationController {
  constructor(private readonly visaApplicationService: VisaApplicationService) {}

  @Post()
  @ApiOperation({ summary: "Create a new visa application" })
  @ApiBody({ type: CreateVisaApplicationRequestBodyDto })
  @ApiResponse({
    status: 201,
    description: "Visa application created successfully",
    type: CreateVisaApplicationSuccessResponseDto,
  })
  async create(@Body() createDto: CreateVisaApplicationRequestBodyDto) {
    return this.visaApplicationService.create(createDto)
  }

  @Get()
  @ApiOperation({ summary: "List visa applications with filtering and pagination" })
  @ApiResponse({
    status: 200,
    description: "List of visa applications",
    type: ListVisaApplicationsSuccessResponseDto,
  })
  async findAll(@Query() query: ListVisaApplicationsRequestQueryDto) {
    return this.visaApplicationService.findAll(query)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get visa application" })
  @ApiResponse({
    status: 200,
    description: "Visa application details",
    type: GetVisaApplicationSuccessResponseDto,
  })
  @ApiParam({ name: "id", description: "Visa application ID" })
  async findOne(@Param("id") id: string) {
    return this.visaApplicationService.findOne(id)
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update visa application status" })
  @ApiBody({ type: UpdateVisaApplicationStatusRequestBodyDto })
  @ApiResponse({
    status: 200,
    description: "Status updated successfully",
    type: UpdateVisaApplicationStatusSuccessResponseDto,
  })
  @ApiParam({ name: "id", description: "Visa application ID" })
  async updateStatus(
    @Param("id") id: string,
    @Body() updateDto: UpdateVisaApplicationStatusRequestBodyDto
  ) {
    return this.visaApplicationService.updateStatus(id, updateDto)
  }

  @Post(":id/notes")
  @ApiOperation({ summary: "Add visa application note" })
  @ApiBody({ type: AddVisaApplicationNoteRequestBodyDto })
  @ApiResponse({
    status: 201,
    description: "Note added successfully",
    type: AddVisaApplicationNoteSuccessResponseDto,
  })
  @ApiParam({ name: "id", description: "Visa application ID" })
  async addNote(@Param("id") id: string, @Body() addNoteDto: AddVisaApplicationNoteRequestBodyDto) {
    return this.visaApplicationService.addNote(id, addNoteDto)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete visa application" })
  @ApiResponse({
    status: 200,
    description: "Visa application deleted successfully",
    type: DeleteVisaApplicationSuccessResponseDto,
  })
  @ApiParam({ name: "id", description: "Visa application ID" })
  async remove(@Param("id") id: string) {
    return this.visaApplicationService.remove(id)
  }
}
