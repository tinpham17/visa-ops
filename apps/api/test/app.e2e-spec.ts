import { Test, TestingModule } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import request from "supertest"
import { AppModule } from "./../src/app.module"

describe("VisaApplicationController (e2e)", () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it("/visa-applications (GET) should return paginated response", () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return request(app.getHttpServer())
      .get("/visa-applications")
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty("data")
        expect(res.body).toHaveProperty("total")
        expect(res.body).toHaveProperty("page")
        expect(res.body).toHaveProperty("limit")
        expect(res.body).toHaveProperty("totalPages")
        expect(Array.isArray(res.body.data)).toBe(true)
      })
  })

  it("/visa-applications (POST) should create visa application", () => {
    const createDto = {
      applicantName: "John Doe",
      email: "john.doe@example.com",
      nationality: "US",
      destinationCountry: "VN",
      visaType: "TOURIST",
      travelDate: "2024-01-01",
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return request(app.getHttpServer())
      .post("/visa-applications")
      .send(createDto)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty("id")
        expect(res.body.applicantName).toBe(createDto.applicantName)
        expect(res.body.email).toBe(createDto.email)
      })
  })
})
