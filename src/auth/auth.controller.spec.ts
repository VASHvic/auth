import { AuthService } from "./services/auth.service";
import { LocalStrategy } from "./strategies/local.strategy";
import { AuthController } from "./auth.controller";
import { JWTStrategy } from "./strategies/jwt.strategy";
import { Test, TestingModule } from "@nestjs/testing";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { getModelToken } from "@nestjs/mongoose";
import { User, UserDocument } from "src/user/schemas/user.schema";
import { Model } from "mongoose";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;
  let mockUserModel: Model<UserDocument>;

  beforeAll(async () => {
    const mock_localAuthGuard = { canActivate: jest.fn(() => true) };

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
      controllers: [AuthController],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue(mock_localAuthGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    mockUserModel = module.get<Model<UserDocument>>(getModelToken(User.name));

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
