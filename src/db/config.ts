import MongoStore from "connect-mongo";
import "dotenv/config";

// Configuration for Mongo
export const mongoDbConfig: { url: string; config: any } = {
  url: process.env.MONGO_URL as string,
  config: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

export const sessionOption = {
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL as string,
    ttl: 10 * 60,
  }),
  secret: process.env.SESSION_SECRET_MONGO as string,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 10 * 60 * 1000,
  },
};
