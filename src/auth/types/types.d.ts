import { User } from "src/user/schemas/user.schema";

export interface PayloadToken {
  sub: string;
}
export type UserType = {
  _id: string;
  name: string;
  email: string;
  password: string;
  __v: string;
};

export type SafeUserType = Pick<UserType, "_id" | "name" | "email">;
