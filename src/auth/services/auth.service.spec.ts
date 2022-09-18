import { JwtService } from "@nestjs/jwt";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Model } from "mongoose";
import { User, UserDocument } from "src/user/schemas/user.schema";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;
  let mockUserModel: Model<UserDocument>;
  jest.setTimeout(60000);
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        JwtService,
        {
          provide: getModelToken(User.name),
          useValue: Model, // <-- Use the Model Class from Mongoose
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    mockUserModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    jest.clearAllMocks();
  });
  afterAll((done) => {
    done();
  });
  it("should be defined", () => {
    expect(service).toBeDefined();
  });
  // it('should return a user doc', async () => {
  //   // arrange
  //   const user = new User();
  //   const userID = '12345';
  //   const spy = jest
  //     .spyOn(mockUserModel, 'findById') // <- spy on what you want
  //     .mockResolvedValue(user as UserDocument); // <- Set your resolved value
  //   // act
  //   await mockRepository.findOneById(userID);
  //   // assert
  //   expect(spy).toBeCalled();
  // });
});
