import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Public } from "../auth/decorators/public.decorator";
import { ApiKeyGuard } from "../auth/guards/api-key.guard";
import { LocalAuthGuard } from "../auth/guards/local-auth.guard";
import { SafeUserType } from "../auth/types/types";
import { MongoIdPipe } from "../common/mongo-id.pipe";
import { createUserDto } from "../dto/createUser.dto";
import { UpdateUserDto } from "../dto/updateUserDto";
import { User } from "./schemas/user.schema";
import { UserErrorService } from "./user-error.service";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userErrorService: UserErrorService,
  ) {}

  // No te molt de sentit
  @UseGuards(ApiKeyGuard)
  @Get("get")
  public async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
  @UseGuards(ApiKeyGuard)
  @Get("getById/:id")
  public async getUserById(
    @Param("id", MongoIdPipe) id: string,
  ): Promise<User> {
    return this.userService.findById(id);
  }

  // no te molt de sentit, si ho lleve, llevar tmb el indice en mongo
  @UseGuards(ApiKeyGuard)
  @Get("getByEmail/:email")
  public async getUserByEmail(
    @Param("email") email: string,
  ): Promise<SafeUserType> {
    const user = await this.userService.findByEmail(email);
    const { password, __v, ...rta } = user;
    return rta;
  }
  @UseGuards(LocalAuthGuard)
  @Patch("update")
  public async updateUser(@Body() dto: UpdateUserDto): Promise<SafeUserType> {
    return this.userService.update(dto);
  }

  @Post("signUp")
  @Public()
  public async signUp(@Body() dto: createUserDto): Promise<SafeUserType> {
    try {
      return await this.userService.signUp(dto);
    } catch (e) {
      const error = await this.userErrorService.saveError(e);
      throw error;
    }
  }
}
