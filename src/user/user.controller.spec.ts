import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken, MongooseModule } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Model } from "mongoose";
import { ApiKeyGuard } from "src/auth/guards/api-key.guard";

describe("UserController", () => {
  let controller: UserController;
  let usersService: UserService;
  let mockUserModel: Model<UserDocument>;

  beforeEach(async () => {
    const mock_ApiKeyGuard = { canActivate: jest.fn(() => true) };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
      ],
      controllers: [UserController],
    })
      .overrideGuard(ApiKeyGuard)
      .useValue(mock_ApiKeyGuard)
      .compile();

    controller = module.get<UserController>(UserController);
    usersService = module.get<UserService>(UserService);
    mockUserModel = module.get<Model<UserDocument>>(getModelToken(User.name));

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
