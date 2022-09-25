import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserErrorDocument } from "./schemas/user-error.schema";

@Injectable()
export class UserErrorService {
  constructor(
    @InjectModel("userError") private userErrorModel: Model<UserErrorDocument>,
  ) {}
  public async saveError(e: any) {
    const newUserError = new this.userErrorModel({ error: e });
    await newUserError.save();
  }
}
