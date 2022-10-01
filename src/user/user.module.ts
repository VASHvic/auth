import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ErrorSchema } from "./schemas/user-error.schema";
import { User, UserSchema } from "./schemas/user.schema";
import { UserErrorService } from "./user-error.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: "userError", schema: ErrorSchema },
    ]),
  ],
  providers: [UserService, UserErrorService],
  controllers: [UserController],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
