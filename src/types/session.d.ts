import { Cookie } from "express-session";

type SessionType = {
  resave: boolean;
  saveUninitialized: boolean;
  secret: string;
  cookie: Cookie | undefined;
};

type SessionCookieType = {
  secure: boolean;
  maxAge: number;
};
