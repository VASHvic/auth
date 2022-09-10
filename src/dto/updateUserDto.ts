import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  newName: string;
  @IsOptional()
  @IsString()
  newEmail: string;
  @IsOptional()
  @IsString()
  newPassword: string;
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;

  //En un futur, es millor pasar _id per a no tindre que fer getByEmail primer
}
