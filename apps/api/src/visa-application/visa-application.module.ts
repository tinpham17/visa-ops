import { Module } from "@nestjs/common"
import { VisaApplicationService } from "./visa-application.service"
import { VisaApplicationController } from "./visa-application.controller"
import { PrismaService } from "../prisma.service"

@Module({
  controllers: [VisaApplicationController],
  providers: [VisaApplicationService, PrismaService],
  exports: [VisaApplicationService],
})
export class VisaApplicationModule {}
