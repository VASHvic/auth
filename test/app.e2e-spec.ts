import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

describe("Starting App", () => {
  let app: INestApplication;
  let randomUser = (Math.random() + 1).toString(36).substring(7);
  let httpServer: any;
  //mirar si pug afafar la conexió com michael guay

  jest.setTimeout(120000);
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    httpServer = app.getHttpServer();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("USER gets all users /user/get (GET)", () => {
    it("should get all users", async () => {
      const response = await request(httpServer)
        .get("/user/get")
        .set("Auth", "abc");

      expect(response.status).toBe(200);
    });
  });

  describe("USER create a user /user/signup (POST)", () => {
    it("should create  a user", async () => {
      const response = await request(httpServer)
        .post("/user/signup")
        .send({
          name: randomUser,
          email: `${randomUser}@mail.com`,
          password: `${randomUser}`,
        });
      //arreplegar id y pasarliu a getById

      expect(response.status).toBe(201);
    });
  });

  describe("AUTH allows to login with the user /user/signup (POST)", () => {
    it("should return the auth token when loged in", async () => {
      const response = await request(httpServer)
        .post("/auth/login")
        .send({
          email: `${randomUser}@mail.com`,
          password: `${randomUser}`,
        });

      expect(response.status).toBe(201);
    });
  });

  describe("USER get the user just created by email /user/signup (GET)", () => {
    it("should return the user requested by email", async () => {
      const path = "/user/getByEmail/" + randomUser + "@mail.com";
      const response = await request(httpServer).get(path).set("Auth", "abc");
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        name: randomUser,
        email: `${randomUser}@mail.com`,
      });
    });

    //TODO: tornar resposta sencera
  });
  describe("USER update the user just created /user/update (PATCH)", () => {
    it("should delete the user", async () => {
      const response = await request(httpServer)
        .patch("/user/update")
        .send({
          name: randomUser,
          email: `${randomUser}@mail.com`,
          password: `${randomUser}`,
          newName: randomUser + "1",
          newPassword: `${randomUser}1`,
          newEmail: `${randomUser}@gmail.com`,
        });
      expect(response.status).toBe(200);
    });
  });

  //afegir delete user
});
