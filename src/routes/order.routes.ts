import cors from "cors";
import { Router, urlencoded } from "express";
import { OrderController } from "../controllers/order.controller";

export class OrderRoutes {
  public router: Router = Router();
  public controller: OrderController = new OrderController();

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

    this.router.get("/:id?", this.controller.getOrderById);
    this.router.post("/", this.controller.createOrder);
    this.router.put("/:id", this.controller.updateOrder);
    this.router.delete("/:id", this.controller.deleteOrder);
  }
}
