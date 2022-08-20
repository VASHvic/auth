import { Controller, UseGuards } from "@nestjs/common";
import { ApiKeyGuard } from "./auth/guards/api-key.guard";

@Controller()
export class AppController {
  constructor() {}
}
