import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
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
    return this.generateTokenForUser(req.user as UserType);
  }
  public generateTokenForUser(user: UserType) {
    return this.authService.generateJWT(user);
  }
}
