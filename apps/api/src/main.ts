import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  })

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("Visa Application API")
    .setDescription("API for managing visa applications")
    .setVersion("1.0")
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app, document)

  await app.listen(process.env.PORT || 3000)
  console.log(`🚀 Application is running on: http://localhost:${process.env.PORT ?? 3000}`)
  console.log(
    `📚 Swagger documentation available at: http://localhost:${process.env.PORT ?? 3000}/api`
  )
}

void bootstrap()
