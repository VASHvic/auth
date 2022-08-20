import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Error, Model } from "mongoose";
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
  update(id: string, changes: UpdateUserDto) {
    delete changes.id;
    return this.userModel.findByIdAndUpdate(id, changes, {
      returnOriginal: false,
    });
  }
}
