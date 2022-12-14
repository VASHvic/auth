import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { createUserDto } from "src/dto/createUser.dto";
import { UpdateUserDto } from "src/dto/updateUserDto";
import { User, UserDocument } from "./schemas/user.schema";
import * as bycript from "bcrypt";
import { SafeUserType, UserType } from "src/auth/types/types";
import { DeleteUserDto } from "src/dto/deleteUser.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  public async signUp(dto: createUserDto): Promise<SafeUserType> {
    const newUser = new this.userModel(dto);
    const hashPass = await bycript.hash(newUser.password, 10);
    newUser.password = hashPass;
    const savedUser = await newUser.save();
    const { password, __v, ...rta } = savedUser.toJSON();
    return rta as SafeUserType;
  }
  public async findAll() {
    return this.userModel.find().exec(); //llevar _v
  }

  public async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  public async findByEmail(email: string): Promise<UserType> {
    const user = await this.userModel.findOne({ email }).exec();
    return user ? (user.toJSON() as UserType) : null;
  }

  public async update(changes: UpdateUserDto, auth: string) {
    const token = auth.split(" ")[1];
    const { sub } = this.jwtService.decode(token);
    const userFromToken = await this.findById(sub);

    const userFromEmail = (await this.findByEmail(changes.email)) as UserType;
    if (
      JSON.stringify(userFromToken) !== JSON.stringify(userFromEmail) // diuen que millorable
    ) {
      throw new Error("Authorization token doesnt belong to User");
    }
    const updated = {} as User;
    if (changes.newName) updated.name = changes.newName;
    if (changes.newPassword)
      updated.password = await bycript.hash(changes.newPassword, 10);
    if (changes.newEmail) updated.email = changes.newEmail;

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userFromEmail._id,
      updated,
      {
        returnOriginal: false,
      },
    );
    const { password, __v, ...rta } = updatedUser.toJSON();
    return rta as SafeUserType;
  }

  public async deleteUser(dto: DeleteUserDto): Promise<boolean> {
    const { deletedCount } = await this.userModel
      .deleteOne({ email: dto.email })
      .exec();
    return deletedCount > 0;
  }
}
