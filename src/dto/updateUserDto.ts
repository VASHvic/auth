import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsString()
  id: string;
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  email: string;
  @IsOptional()
  @IsString()
  password: string;
}
