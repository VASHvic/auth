import { UserController } from "../../user/user.controller";
import { ApiKeyGuard } from "./api-key.guard";

describe("ApiKeyGuard", () => {
  it("APiKey Guard protects findAll Route", () => {
    const guards = Reflect.getMetadata(
      "__guards__",
      UserController.prototype.findAll,
    );
    const guard = new guards[0]();

    expect(guard).toBeInstanceOf(ApiKeyGuard);
  });
});
