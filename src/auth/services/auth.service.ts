import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserService } from "src/user/user.service";
import { PayloadToken, SafeUserType } from "../types/types";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    delete user.password;
    delete user.__v;
    return isMatch ? user : null;
  }

  generateJWT(user: SafeUserType) {
    const payload: PayloadToken = { sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
