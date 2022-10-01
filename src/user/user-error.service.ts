import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserErrorDocument } from "./schemas/user-error.schema";

@Injectable()
export class UserErrorService {
  constructor(
    @InjectModel("userError") private userErrorModel: Model<UserErrorDocument>,
  ) {}
  public async saveError(e: any) {
    let errorMesage: string;
    if (e.code === 11000) {
      errorMesage = `A User with ${Object.entries(e.keyValue)} already exists`;
    }
    const error = new BadRequestException(errorMesage ?? "Unknow Error");
    const newUserError = new this.userErrorModel({ error });
    await newUserError.save();
    return error;
  }
}
