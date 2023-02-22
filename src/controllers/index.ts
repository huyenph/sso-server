import { Request, Response, NextFunction } from "express";
import * as url from "url";
import authHelper from "../helpers/auth.helper";
import dbHelper from "../helpers/db.helper";

const AUTH_HEADER = "authorization";
const BEARER_AUTH_SCHEME = "bearer";

const onAuthorized = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.session.user);
};

const renderLoginView = (req: Request, res: Response, next: NextFunction) => {
  const query = url.parse(req.url, true).query;
  return res.render("login", {
    title: "SSO Server | Sign in",
    responseType: query["responseType"],
    clientID: query["clientID"],
    serviceURL: query["serviceURL"],
  });
};

const onLogin = async (req: Request, res: Response) => {
  if (req.body) {
    const { email, password, clientID, serviceURL } = req.body;

    if (serviceURL === null) {
      return res.redirect("/");
    }

    dbHelper.checkCredential(
      email,
      password,
      (result: UserType | undefined) => {
        if (result !== undefined) {
          // create global session here
          req.session.user = result;
          authHelper.sessionUser[result.userID] = result;

          // create authorization token
          const code = authHelper.generateAuthorizationCode(
            clientID,
            serviceURL
          );
          authHelper.storeClientInCache(serviceURL, result.userID, code);

          // redirect to client with an authorization token
          return res.redirect(302, `${serviceURL}?authorizationCode=${code}`);
        } else {
          return res
            .status(404)
            .send({ success: false, message: "User not found" });
        }
      }
    );
  } else {
    return res.redirect("/");
  }
};

const onGetToken = async (req: Request, res: Response) => {
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

    const token = await authHelper.generateAccessToken(
      authorization_code,
      client_id,
      client_secret
    );
    res.status(200).send({
      access_token: token,
      token_type: "JWT",
    });
  } else {
    return res.status(400).send({ message: "Invalid request" });
  }
};

export default { onAuthorized, renderLoginView, onLogin, onGetToken };
