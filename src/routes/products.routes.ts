import { Router, urlencoded } from "express";
import adminMiddleware from "../middlewares/admin.middleware";
import { ProductController } from "../controllers/product.controller";
import cors from "cors";
import isValidToken from "../middlewares/token.middleware";

export class ProductRoutes {
  public router: Router = Router();
  public controller: ProductController = new ProductController();

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

    this.router.get("/:id?", isValidToken, this.controller.getProductById);
    this.router.post(
      "/",
      isValidToken,
      adminMiddleware,
      this.controller.createProduct
    );
    this.router.put(
      "/:id",
      isValidToken,
      adminMiddleware,
      this.controller.updateProduct
    );
    this.router.delete(
      "/:id",
      isValidToken,
      adminMiddleware,
      this.controller.deleteProduct
    );
  }
}
