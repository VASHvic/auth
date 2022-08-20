import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  SetMetadata,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { ApiKeyGuard } from "src/auth/guards/api-key.guard";
import { MongoIdPipe } from "src/common/mongo-id.pipe";
import { createUserDto } from "src/dto/createUser.dto";
import { UpdateUserDto } from "src/dto/updateUserDto";
import { User } from "./schemas/user.schema";
import { UserService } from "./user.service";

@UseGuards(ApiKeyGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("get")
  public async getHello(): Promise<User[]> {
    return this.userService.findAll();
  }
  @Get("getById/:id")
  public async getUserById(
    @Param("id", MongoIdPipe) id: string,
  ): Promise<User> {
    return this.userService.findById(id);
  }
  @Get("getByEmail/:email")
  public async getUserByEmail(@Param("email") email: string): Promise<User> {
    return this.userService.findByEmail(email);
  }
  @Patch("update")
  public async updateUser(@Body() dto: UpdateUserDto): Promise<any> {
    return this.userService.update(dto.id, dto);
  }

  @Post("signUp")
  @SetMetadata("isPublic", true)
  public async signUp(@Body() dto: createUserDto) {
    return this.userService.signUp(dto);
  }
}
