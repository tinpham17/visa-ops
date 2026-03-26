import { Injectable, NotFoundException, Inject } from "@nestjs/common"
import { Prisma } from "../generated/prisma/client"
import { PrismaService } from "../prisma.service"
import type {
  CreateVisaApplicationRequestBodyDto,
  CreateVisaApplicationSuccessResponseDto,
} from "./dto/create-visa-application.dto"
import type {
  UpdateVisaApplicationStatusRequestBodyDto,
  UpdateVisaApplicationStatusSuccessResponseDto,
} from "./dto/update-visa-application-status.dto"
import type {
  AddVisaApplicationNoteRequestBodyDto,
  AddVisaApplicationNoteSuccessResponseDto,
} from "./dto/add-visa-application-note.dto"
import type { DeleteVisaApplicationSuccessResponseDto } from "./dto/delete-visa-application.dto"
import type {
  ListVisaApplicationsRequestQueryDto,
  ListVisaApplicationsSuccessResponseDto,
} from "./dto/list-visa-applications.dto"
import type { GetVisaApplicationSuccessResponseDto } from "./dto/get-visa-application.dto"

@Injectable()
export class VisaApplicationService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async create(
    createDto: CreateVisaApplicationRequestBodyDto
  ): Promise<CreateVisaApplicationSuccessResponseDto> {
    const application = await this.prisma.visaApplication.create({
      data: {
        ...createDto,
        travelDate: new Date(createDto.travelDate),
      },
      include: {
        notes: true,
      },
    })

    const formattedApplication = {
      ...application,
      travelDate: application.travelDate.toISOString(),
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
      notes: application.notes?.map((note) => ({
        ...note,
        createdAt: note.createdAt.toISOString(),
      })),
    }

    return {
      data: formattedApplication,
    }
  }

  async findAll(
    query: ListVisaApplicationsRequestQueryDto
  ): Promise<ListVisaApplicationsSuccessResponseDto> {
    const { page = 1, limit = 10, search, status } = query
    const skip = (page - 1) * limit

    const where: Prisma.VisaApplicationWhereInput = {}

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        {
          applicantName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ]
    }

    const [applications, total] = await Promise.all([
      this.prisma.visaApplication.findMany({
        where,
        include: {
          notes: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      this.prisma.visaApplication.count({ where }),
    ])

    const formattedApplications = applications.map((app) => ({
      ...app,
      travelDate: app.travelDate.toISOString(),
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
      notes: app.notes.map((note) => ({
        ...note,
        createdAt: note.createdAt.toISOString(),
      })),
    }))

    return {
      data: formattedApplications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findOne(id: string): Promise<GetVisaApplicationSuccessResponseDto> {
    const application = await this.prisma.visaApplication.findUnique({
      where: { id },
      include: {
        notes: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!application) {
      throw new NotFoundException(`Visa application with ID ${id} not found`)
    }

    const formattedApplication = {
      ...application,
      travelDate: application.travelDate.toISOString(),
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
      notes: application.notes.map((note) => ({
        ...note,
        createdAt: note.createdAt.toISOString(),
      })),
    }

    return {
      data: formattedApplication,
    }
  }

  async updateStatus(
    id: string,
    updateDto: UpdateVisaApplicationStatusRequestBodyDto
  ): Promise<UpdateVisaApplicationStatusSuccessResponseDto> {
    const application = await this.prisma.visaApplication.findUnique({
      where: { id },
    })

    if (!application) {
      throw new NotFoundException(`Visa application with ID ${id} not found`)
    }

    const updatedApplication = await this.prisma.visaApplication.update({
      where: { id },
      data: { status: updateDto.status },
      include: {
        notes: true,
      },
    })

    const formattedApplication = {
      ...updatedApplication,
      travelDate: updatedApplication.travelDate.toISOString(),
      createdAt: updatedApplication.createdAt.toISOString(),
      updatedAt: updatedApplication.updatedAt.toISOString(),
      notes: updatedApplication.notes?.map((note) => ({
        ...note,
        createdAt: note.createdAt.toISOString(),
      })),
    }

    return {
      data: formattedApplication,
    }
  }

  async addNote(
    id: string,
    addNoteDto: AddVisaApplicationNoteRequestBodyDto
  ): Promise<AddVisaApplicationNoteSuccessResponseDto> {
    const application = await this.prisma.visaApplication.findUnique({
      where: { id },
    })

    if (!application) {
      throw new NotFoundException(`Visa application with ID ${id} not found`)
    }

    const note = await this.prisma.visaApplicationNote.create({
      data: {
        ...addNoteDto,
        applicationId: id,
      },
    })

    const formattedNote = {
      ...note,
      createdAt: note.createdAt.toISOString(),
    }

    return {
      data: formattedNote,
    }
  }

  async remove(id: string): Promise<DeleteVisaApplicationSuccessResponseDto> {
    const application = await this.prisma.visaApplication.findUnique({
      where: { id },
    })

    if (!application) {
      throw new NotFoundException(`Visa application with ID ${id} not found`)
    }

    const deletedApplication = await this.prisma.visaApplication.delete({
      where: { id },
    })

    const formattedApplication = {
      ...deletedApplication,
      travelDate: deletedApplication.travelDate.toISOString(),
      createdAt: deletedApplication.createdAt.toISOString(),
      updatedAt: deletedApplication.updatedAt.toISOString(),
    }

    return {
      data: formattedApplication,
    }
  }
}
