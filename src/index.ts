import express, { Express, NextFunction, Request, Response } from "express";
import session from "express-session";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import dbHelper from "./helpers/db.helper";
import router from "./routers";
import { SessionCookieType, SessionType } from "./types/session";

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
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  const user = req.session.user || "unlogged";
  res.render("login", {
    title: "SSO Server",
  });
});

// Catch 404 and forward to error handler
// app.use((req: Request, res: Response, next: NextFunction) => {
//   const err: Error = new Error("Resource Not Found");
//   next(err);
// });

// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   console.error({
//     message: err.message,
//     error: err,
//   });
//   const message = err.message || "Internal Server Error";
//   return res.status(500).json({ message });
// });

app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
  dbHelper.syncAllModels();
});

export default app;
