import "dotenv/config";
import cors from "cors";
import { urlencoded } from "body-parser";
import { CartController } from "./../controllers/cart.controller";
import { Router } from "express";
import isValidToken from "../middlewares/token.middleware";

export class CartRoutes {
  public router: Router = Router();
  public controller: CartController = new CartController();

  constructor() {
    this.init();
  }

  public init() {
    this.router.use(
      urlencoded({
        extended: true,
      })
    );

    this.router.use(cors());

    this.router.get(
      "/:id/productos",
      isValidToken,
      this.controller.getAllProductsByCartId
    );
    this.router.post("/", isValidToken, this.controller.createNewCart);
    this.router.post(
      "/:id/productos",
      isValidToken,
      this.controller.addProductsToCart
    );
    this.router.delete("/:id", isValidToken, this.controller.deleteCart);
    this.router.delete(
      "/:id/productos/:id_prod",
      isValidToken,
      this.controller.deleteProductInCart
    );
    this.router.post(
      "/createOrder/:id",
      isValidToken,
      this.controller.createOrder
    );
  }
}
