import { IsNotEmpty, IsString } from "class-validator";

export class createUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
