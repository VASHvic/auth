import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User } from "src/user/schemas/user.schema";
import { UserService } from "src/user/user.service";

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
    return isMatch ? user : null;
  }

  generateJWT(user: User & { _id: string }) {
    const payload: { sub: string } = { sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
