import { IsOptional, IsString } from "class-validator";

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
  email: string;
  @IsString()
  password: string;
  @IsString()
  id: string;
}
