import express, { Express, NextFunction, Request, Response } from "express";
import session from "express-session";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import dbHelper from "./helpers/db.helper";
import router from "./routers";

dotenv.config();

const port = process.env.PORT || 3001;

const app: Express = express();

let sessionCookie: SessionCookieType = {
  secure: false,
};

let sess: SessionType = {
  resave: true,
  saveUninitialized: true,
  secret: "secretKey",
  cookie: sessionCookie,
};
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
  sessionCookie.secure = true;
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use((_: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
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
// app.get("/", (req: Request, res: Response, next: NextFunction) => {
//   const user = req.session.user || "unlogged";
//   res.render("login", {
//     title: "SSO Server | Sign in",
//   });
// });

app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
  dbHelper.syncAllModels();
  // dbHelper.insertUser(
  //   "Huyen Pham dev",
  //   "123456",
  //   "huyenp1@gmail.com",
  //   true,
  //   "developer"
  // );
});

export default app;
