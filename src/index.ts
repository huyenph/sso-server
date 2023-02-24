import express, { Express, NextFunction, Request, Response } from "express";
import session, { CookieOptions, SessionOptions } from "express-session";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routers";
import { insertUser } from "./data/user.db";
import { initAllModels } from "./data/database";

dotenv.config();

const port = process.env.PORT || 3001;

const app: Express = express();

let sess: SessionOptions = {
  resave: true,
  saveUninitialized: true,
  secret: "secretKey",
  cookie: <CookieOptions>{
    secure: false,
    maxAge: process.env.MAX_AGE as any,
    originalMaxAge: process.env.MAX_AGE as any,
  },
};
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
  sess = {
    ...sess,
    cookie: <CookieOptions>{
      secure: false,
      maxAge: process.env.MAX_AGE as any,
      originalMaxAge: process.env.MAX_AGE as any,
    },
  };
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use((_: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(
  cors({
    origin: process.env.CORS_HOSTS!.split(","),
    methods: ["GET", "POST"],
  })
);
app.use(session(sess));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use("/sso", router);

app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
  initAllModels();
  // const user: UserModel = <UserModel>{
  //   username: "Huyen Pham",
  //   password: "123456",
  //   email: "huyenp@gmail.com",
  //   isActive: false,
  //   role: "developer",
  //   createdAt: new Date(),
  // };
  // insertUser(<UserModel>{
  //   username: "Huyen Pham",
  //   password: "123456",
  //   email: "huyenp@gmail.com",
  //   isActive: true,
  //   role: "admin",
  // });
});

export default app;
