import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import path from "path";
import multer from "multer";
import bodyParser from "body-parser";
import parseArgs from "minimist";
import cluster from "cluster";
import os from "os";
import "dotenv/config";
import { sessionOption } from "./db/config";
import initializePassport from "./passport";
import { DB_TYPE } from "./daos/MyDaoFactory";

import routingErrorMiddleware from "./middlewares/routing.middleware";
import { CartRoutes } from "./routes/cart.routes";
import { AuthRoutes } from "./routes/auth.routes";
import { ProductRoutes } from "./routes/products.routes";
import { OrderRoutes } from "./routes/order.routes";
import { MessageRoutes } from "./routes/message.routes";
import { MessageService } from "./services/message.service";
import { Server as IOServer } from "socket.io";
import { Server as HttpServer } from "http";

const app = express();
const defaultOptions = { default: { port: 8080 } };
const args = parseArgs(process.argv.slice(2), defaultOptions);
const numeroCPUs = os.cpus().length;
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer, {
  cors: {
    origin: "*",
  },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());
initializePassport();
var dir = path.join(__dirname, "/uploads");
app.use(express.static(dir));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.set("socketio", io);

app.use("/api/productos", new ProductRoutes().router);
app.use("/api/carrito", new CartRoutes().router);
app.use("/api/auth", new AuthRoutes().router);
app.use("/api/orders", new OrderRoutes().router);
app.use("/api/chat", new MessageRoutes().router);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "./uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});
var upload = multer({ storage: storage });

app.post("/upload", upload.single("profile-file"), async (req, res) => {
  const file = req.file;
  res.send(file);
});

app.all("*", routingErrorMiddleware, () => {
  console.log("Esta ruta no esta implementada.");
});

const port = process.env.PORT || 8080;
const persistance = process.env.PERSISTANCE || DB_TYPE.MONGO;

if (args.modo && args.modo === "cluster") {
  if (cluster.isPrimary) {
    for (let i = 0; i < numeroCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
      console.log(`Process ${worker.process.pid} destroyed!`);
      cluster.fork();
    });
  } else {
    httpServer.listen(port, async () => {
      console.log(
        `CLUSTER MODE: server initialized on port ${port}...`
      );
    });
  }
} else {
  httpServer.listen(port, async () => {
    console.log(
      `FORK MODE: server initialized with ${persistance} on port ${port}...`
    );
  });
}

io.on(
  "connection",
  (socket: {
    on: (arg0: string, arg1: (data: any) => Promise<void>) => void;
  }) => {
    console.log("Usuario conectado.");

    socket.on("newMessage", async (data) => {
      try {
        const newMessage = await MessageService.getInstance().create({
          email: data.email,
          type: data.type,
          body: data.body,
        });
        io.sockets.emit("newUserMessage", newMessage);
      } catch (err) {
        console.log(err);
      }
    });
  }
);
