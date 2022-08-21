import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { createUserDto } from "src/dto/createUser.dto";
import { UpdateUserDto } from "src/dto/updateUserDto";
import { User, UserDocument } from "./schemas/user.schema";
import * as bycript from "bcrypt";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async signUp(dto: createUserDto) {
    const newUser = new this.userModel(dto);
    const hashPass = await bycript.hash(newUser.password, 10);
    newUser.password = hashPass;
    const savedUser = await newUser.save();
    const { password, ...rta } = savedUser.toJSON();
    return rta;
  }
  findAll() {
    return this.userModel.find().exec();
  }
  findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }
  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    return user ? (user.toJSON() as User) : null;
  }
  async update(id: string, changes: UpdateUserDto) {
    const updated = {};
    if (changes.newName) updated["name"] = changes.newName;
    if (changes.newPassword)
      updated["password"] = await bycript.hash(changes.newPassword, 10);
    if (changes.newEmail) updated["email"] = changes.newEmail;

    const updatedUser = await this.userModel.findByIdAndUpdate(id, updated, {
      returnOriginal: false,
    });
    console.log(updatedUser);

    const { password, __v, ...rta } = updatedUser.toJSON();
    return rta;
  }
}
