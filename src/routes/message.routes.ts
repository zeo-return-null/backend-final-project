import cors from "cors";
import { Router, urlencoded } from "express";
import { MessageController } from "../controllers/message.controller";

export class MessageRoutes {
  public router: Router = Router();
  public controller: MessageController = new MessageController();

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

    this.router.get("/:email?", this.controller.getMessageById);
    this.router.post("/", this.controller.createMessage);
    this.router.put("/:id", this.controller.updateMessage);
    this.router.delete("/:id", this.controller.deleteMessage);
  }
}
