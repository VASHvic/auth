import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import config from "src/config";
import { MongooseModule } from "@nestjs/mongoose";

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let randomUser = (Math.random() + 1).toString(36).substring(7);

  jest.setTimeout(120000);
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot({
          envFilePath: ".env",
          load: [config],
          isGlobal: true,
        }),
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (config: ConfigService) => ({
            uri: config.get<string>("MONGO_URI"),
          }),
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/user/get (GET)", () => {
    return request(app.getHttpServer())
      .get("/user/get")
      .set("Auth", "abc")
      .expect(200);
  });
  it("/user/signup (POST)", () => {
    return request(app.getHttpServer())
      .post("/user/signup")
      .send({
        name: randomUser,
        email: `${randomUser}@mail.com`,
        password: `${randomUser}`,
      })
      .expect(201);
  });
  it("/user/signup (GET)", () => {
    const path = "/user/getByEmail/" + randomUser + "@mail.com";
    console.log(path);

    return request(app.getHttpServer())
      .get(path)
      .set("Auth", "abc")
      .expect(200);
    //TODO: tornar resposta sencera
  });

  //afegir delete user

  afterAll(async () => {
    await app.close();
  });
});
