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
import { Public } from "src/auth/decorators/public.decorator";
import { ApiKeyGuard } from "src/auth/guards/api-key.guard";
import { LocalAuthGuard } from "src/auth/guards/local-auth.guard";
import { SafeUserType } from "src/auth/types/types";
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
      let errorMesage: string;
      if (e.code === 11000) {
        errorMesage = `A User with ${Object.entries(
          e.keyValue,
        )} already exists`;
      }
      throw new BadRequestException(errorMesage ?? "Unknow Error");
    }
  }
}
