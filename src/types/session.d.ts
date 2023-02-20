export type SessionType = {
  resave: boolean;
  saveUninitialized: boolean;
  secret: string;
  cookie: SessionCookieType | undefined;
};

export type SessionCookieType = {
  secure: boolean;
};
