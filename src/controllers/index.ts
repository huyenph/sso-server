import { Request, Response, NextFunction } from "express";
import authHelper from "../helpers/auth.helper";
import dbHelper from "../helpers/db.helper";

const AUTH_HEADER = "authorization";
const BEARER_AUTH_SCHEME = "bearer";

const onInit = (req: Request, res: Response, next: NextFunction) => {
  const query = req.query["redirect_url"];
  try {
    if (typeof query === "string") {
      const originUrl = new URL(query).origin;
      if (originUrl) {
        if (!authHelper.alloweOrigin[originUrl]) {
          return res
            .status(400)
            .send({ message: "You are not allow to access SSO server" });
        }
        if (req.session.user !== undefined) {
          const code = authHelper.generateAuthorizationCode(
            req.session.user.id,
            query
          );
          authHelper.storeClientInCache(query, req.session.user.id, code);
          // redirect to client with an authorization token
          res.redirect(302, query + `?authorization_code=${code}`);
        } else {
          res.redirect("/oauth/authorize");
        }
      }
    }
    return res.status(400).send({ message: "Invalid client" });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const renderLoginView = (req: Request, res: Response, next: NextFunction) => {
  const user = req.session.user || "unlogged";
  return res.render("login", {
    title: "SSO Server | Sign in",
  });
};

const onSignin = (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;
  const clientId = req.body.client_id;
  const redirectUrl = req.body.redirect_url;

  dbHelper.checkCredential(username, password, (user: UserType) => {
    // create global session here
    req.session.user = user;
    (authHelper.sessionUser as any)[user.userId] = user;
    if (redirectUrl === null) {
      return res.redirect("/");
    }

    // create authorization token
    const code = authHelper.generateAuthorizationCode(clientId, redirectUrl);
    authHelper.storeClientInCache(redirectUrl, user.userId, code);

    // redirect to client with an authorization token
    res.redirect(302, redirectUrl + `?authorization_code=${code}`);
  });
};

const onToken = (req: Request, res: Response) => {
  if (req.body) {
    const { authorization_code, client_id, client_secret, redirect_url } =
      req.body;

    if (!authHelper.authenticateClient(client_id, client_secret)) {
      return res.status(400).send({ message: "Invalid client" });
    }

    if (
      !authHelper.verifyAuthorizationCode(
        req.get("Authorization")!,
        authorization_code,
        client_id,
        redirect_url
      )
    ) {
      return res.status(400).send({ message: "Access denied" });
    }

    const token = authHelper.generateAccessToken(
      authorization_code,
      client_id,
      client_secret
    );
    return res.status(200).send({
      access_token: token,
      token_type: "JWT",
    });
  } else {
    return res.status(400).send({ message: "Invalid request" });
  }
};

export default { onInit, renderLoginView, onSignin, onToken };
