type SessionType = {
  resave: boolean;
  saveUninitialized: boolean;
  secret: string;
  cookie: SessionCookieType | undefined;
};

type SessionCookieType = {
  secure: boolean;
};
