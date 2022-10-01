import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Model } from "mongoose";
import { ApiKeyGuard } from "src/auth/guards/api-key.guard";
import { UserErrorService } from "./user-error.service";
import { UserErrorDocument } from "./schemas/user-error.schema";

describe("UserController", () => {
  let userController: UserController;
  let usersService: UserService;
  let userErrorService: UserErrorService;
  let mockUserModel: Model<UserDocument>;
  let mockUserErrorModel: Model<UserErrorDocument>;

  beforeEach(async () => {
    const mock_ApiKeyGuard = { canActivate: jest.fn(() => true) };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserErrorService,
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
        {
          provide: getModelToken("userError"),
          useValue: Model,
        },
      ],
      controllers: [UserController],
    })
      .overrideGuard(ApiKeyGuard)
      .useValue(mock_ApiKeyGuard)
      .compile();

    userController = module.get<UserController>(UserController);
    usersService = module.get<UserService>(UserService);
    userErrorService = module.get<UserErrorService>(UserErrorService);
    mockUserModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    mockUserErrorModel = module.get<Model<UserErrorDocument>>(
      getModelToken("userError"),
    );

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(userController).toBeDefined();
  });
});
