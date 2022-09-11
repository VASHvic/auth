import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { User } from "src/user/schemas/user.schema";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { AuthService } from "./services/auth.service";
import { SafeUserType, UserType } from "./types/types";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  public async login(
    @Req() req: Request,
  ): Promise<{ user: SafeUserType; access_token: string }> {
    // EL Guard pilla el body y combroba els camps contra la BD
    const user = req.user as UserType;
    const token = this.authService.generateJWT(user);
    return token;
  }
}
