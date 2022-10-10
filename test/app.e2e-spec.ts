import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import {
  newMockUser,
  newMockUserNoPass,
  randomMockUser,
  updatedMockUser,
  updatedMockUserDto,
} from "./e2e.constants";

describe("Starting App", () => {
  let app: INestApplication;
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

  describe("USER create a user /user/signup (POST)", () => {
    it("should create  a user", async () => {
      const response = await request(httpServer)
        .post("/user/signup")
        .send(newMockUser);
      //arreplegar id y pasarliu a getById

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(newMockUserNoPass);
    });
  });

  describe("USER gets all users /user/get (GET)", () => {
    it("should give unauthroized when no Auth token", async () => {
      const response = await request(httpServer).get("/user/get");
      expect(response.status).toBe(401);
    });

    it("should return all users", async () => {
      const response = await request(httpServer)
        .get("/user/get")
        .set("Auth", "abc");
      const AllUsers = response.body as any[];
      const [firstUser] = AllUsers;
      expect(response.status).toBe(200);
      expect(AllUsers.length).toBeGreaterThanOrEqual(1);
      expect(firstUser).toHaveProperty("email");
      expect(firstUser).toHaveProperty("password"); // TODO: mirar si es pot fer tot de una
      expect(firstUser).toHaveProperty("name");
      expect(firstUser).not.toHaveProperty("mal");
    });
  });

  describe("AUTH allows to login with the user /user/signup (POST)", () => {
    it("should return the auth token when loged in", async () => {
      const response = await request(httpServer)
        .post("/auth/login")
        .send(newMockUser);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        access_token: expect.any(String),
        user: {
          _id: expect.any(String),
          name: randomMockUser,
          email: `${randomMockUser}@mail.com`,
        },
      });
    });
  });

  describe("USER get the user just created by email /user/signup (GET)", () => {
    it("should return the user requested by email", async () => {
      const path = "/user/getByEmail/" + randomMockUser + "@mail.com";
      const response = await request(httpServer).get(path).set("Auth", "abc");
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(newMockUserNoPass);
    });
  });
  describe("USER update the user just created /user/update (PATCH)", () => {
    it("should uypdate the user", async () => {
      const response = await request(httpServer)
        .patch("/user/update")
        .send(updatedMockUserDto);
      expect(response.status).toBe(200);
    });
  });

  describe("USER delete the user just updated /user/delete (DELETE)", () => {
    it("should fail to delete the user when no valid password", async () => {
      const response = await request(httpServer).delete("/user/delete").send();
      expect(response.status).toBe(401);
    });

    it("should delete the user", async () => {
      const response = await request(httpServer)
        .delete("/user/delete")
        .send(updatedMockUser);
      expect(response.status).toBe(200);
      expect(response.text).toBe("true");
    });
  });
});
