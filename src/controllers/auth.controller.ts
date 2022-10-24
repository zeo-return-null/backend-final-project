import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { GenericException } from "./../models/GenericException";
import { errorLogger } from "../log/logger";
import { AuthService } from "../services/auth.service";
import { User } from "../models/User";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = AuthService.getInstance();
  }

  public getMe: RequestHandler = async (req, res) => {
    const token = req.params.token;
    let userRes;
    jwt.verify(token, "coderhouse_codification_key", (err: any, user: any) => {
      if (err) {
        res.status(401).json({
          message: "Invalid token",
        });
        return;
      }
      userRes = { user: user._doc };
    });
    res.json(userRes);
  };

  public login: RequestHandler = async (req, res) => {
    const { username, password } = req.body;
    try {
      await this.authService.login(username, password, (resObj) => {
        res.json(resObj);
      });
    } catch (err) {
      errorLogger.error(`Error: ${err}`);
      throw new GenericException({
        status: 500,
        message: "Internal server error.",
      });
    }
  };

  public register: RequestHandler = async (req, res) => {
    const userBody: User = req.body;
    try {
      const userResponse = await this.authService.register(userBody);
      res.send(userResponse);
    } catch (err) {
      errorLogger.error(`Error: ${err}`);
      throw new GenericException({
        status: 500,
        message: "Internal server error.",
      });
    }
  };
}
