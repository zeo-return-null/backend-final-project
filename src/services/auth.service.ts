import "dotenv/config";
import { CartDaoMongo } from "./../daos/carritos/CartDaoMongo";
import { GenericException } from "./../models/GenericException";
import { User } from "./../models/User";
import { UserDaoMongo } from "./../daos/users/UserDaoMongo";
import { DB_TYPE, MyDaoFactory } from "../daos/MyDaoFactory";
import { Cart } from "../models/Cart";
import { createTransport } from "nodemailer";
import { CartDaoFs } from "../daos/carritos/CartDaoFs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// NODEMAILER
const transporter = createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.NODEMAILER_TEST_MAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

export class AuthService {
  private static instance: AuthService;
  private userDao: UserDaoMongo;
  private cartDao: CartDaoMongo | CartDaoFs;

  constructor() {
    const persistance = (process.env.PERSISTANCE as DB_TYPE) || DB_TYPE.MONGO;
    this.userDao = MyDaoFactory.getInstance().createUserDao(persistance);
    this.cartDao = MyDaoFactory.getInstance().createCartDao(persistance);
  }

  static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async getMe(token: string, completion: (resObj: any) => void) {
    jwt.verify(token, "coderhouse_codification_key", (err: any, user: any) => {
      if (err) {
        throw new GenericException({ status: 401, message: "Invalid token." });
      }
      completion({ user: user._doc });
    });
  }

  // login
  async login(
    username: string,
    password: string,
    completion: (userRes: any) => void
  ) {
    //validar que el usuario exista en la base de datos
    const user = await this.userDao.checkIfUserExists(username);
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          jwt.sign(
            { ...user, password: undefined },
            "coderhouse_codification_key",
            { expiresIn: "1h" },
            (err, token) => {
              if (err) {
                throw new GenericException({
                  status: 404,
                  message: "Token generation error",
                });
              }
              const resObj = { token, user };
              completion(resObj);
            }
          );
        } else {
          throw new GenericException({
            status: 402,
            message: "Invalid credentials.",
          });
        }
      });
    } else {
      throw new GenericException({ status: 404, message: "User not found." });
    }
  }

  // register
  async register(userBody: User) {
    const existsUser = await this.userDao.checkIfUserExists(userBody.username);
    const self = this;
    if (existsUser) {
      throw new GenericException({
        status: 404,
        message: "User already exists.",
      });
    } else {
      bcrypt.hash(userBody.password, 10, async function (err, hash) {
        const newCart: Cart = {
          productos: [],
        };
        const response = await self.cartDao.addItem(newCart);
        userBody.password = hash;
        userBody.cartId = response.id;
        const result = await self.userDao.addItem(userBody);

        const mailOptions = {
          from: "Servidor NodeJS",
          to: process.env.NODEMAILER_TEST_MAIL,
          subject: "Nuevo registro",
          html: `
                        <div class="card" style="width: 18rem;">
                            <p>Username: ${userBody.username}</p>
                            <p>Nombre: ${userBody.name}</p>
                            <p>Dirección: ${userBody.address}</p>
                            <p>Edad: ${userBody.year}</p>
                            <p>Teléfono: ${userBody.phone}</p>
                        </div>
                    `,
        };

        let info = await transporter.sendMail(mailOptions);
        return {
          ok: true,
          user: result,
        };
      });
    }
  }
}
