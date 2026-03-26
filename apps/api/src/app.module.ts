import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { VisaApplicationModule } from "./visa-application/visa-application.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    VisaApplicationModule,
  ],
})
export class AppModule {}
