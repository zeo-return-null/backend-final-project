import { Router, urlencoded } from "express";
import passport from "passport";
import "dotenv/config";
import { AuthController } from "../controllers/auth.controller";
import cors from "cors";

declare module "express-session" {
  interface SessionData {
    username: string;
  }
}

export class AuthRoutes {
  public router: Router = Router();
  public controller: AuthController = new AuthController();

  constructor() {
    this.init();
  }

  public init() {
    this.router.use(
      urlencoded({
        extended: true,
      })
    );

    this.router.use(
      cors({
        credentials: true,
        origin: true,
      })
    );

    this.router.get("/getMe/:token", this.controller.getMe);
    this.router.post(
      "/login",
      passport.authenticate("loginStrategy"),
      this.controller.login
    );
    this.router.post("/register", this.controller.register);
  }
}
