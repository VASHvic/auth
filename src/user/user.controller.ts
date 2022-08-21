import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Public } from "src/auth/decorators/public.decorator";
import { ApiKeyGuard } from "src/auth/guards/api-key.guard";
import { LocalAuthGuard } from "src/auth/guards/local-auth.guard";
import { MongoIdPipe } from "src/common/mongo-id.pipe";
import { createUserDto } from "src/dto/createUser.dto";
import { UpdateUserDto } from "src/dto/updateUserDto";
import { User } from "./schemas/user.schema";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(ApiKeyGuard)
  @Get("get")
  public async getHello(): Promise<User[]> {
    return this.userService.findAll();
  }
  @UseGuards(ApiKeyGuard)
  @Get("getById/:id")
  public async getUserById(
    @Param("id", MongoIdPipe) id: string,
  ): Promise<User> {
    return this.userService.findById(id);
  }
  @UseGuards(ApiKeyGuard)
  @Get("getByEmail/:email")
  public async getUserByEmail(@Param("email") email: string): Promise<User> {
    return this.userService.findByEmail(email);
  }
  @UseGuards(LocalAuthGuard)
  @Patch("update")
  public async updateUser(@Body() dto: UpdateUserDto): Promise<any> {
    return this.userService.update(dto.id, dto);
  }

  @Post("signUp")
  @Public()
  public async signUp(@Body() dto: createUserDto) {
    return this.userService.signUp(dto);
  }
}
