import { Request, Response, NextFunction } from "express";
import * as url from "url";
import authHelper from "../helpers/auth.helper";
import dbHelper from "../helpers/db.helper";

const AUTH_HEADER = "authorization";
const BEARER_AUTH_SCHEME = "bearer";

const onAuthorize = (req: Request, res: Response, next: NextFunction) => {
  const redirectUrl = req.query["redirect_url"];
  try {
    if (typeof redirectUrl === "string") {
      const originUrl = new URL(redirectUrl).origin;
      if (originUrl) {
        if (!authHelper.alloweOrigin[originUrl]) {
          return res
            .status(400)
            .send({ message: "You are not allow to access SSO server" });
        }
        // if (req.session.user !== undefined) {
        //   const code = authHelper.generateAuthorizationCode(
        //     req.session.user.id,
        //     redirectUrl
        //   );
        //   authHelper.storeClientInCache(redirectUrl, req.session.user.id, code);
        //   // redirect to client with an authorization token
        //   return res.redirect(302, redirectUrl + `?authorization_code=${code}`);
        // } else {
        //   return res.redirect(
        //     `/sso/authorize?response_type=${req.query["response_type"]}&client_id=${req.query["client_id"]}&redirect_url=${redirectUrl}`
        //   );
        // }
        return res.redirect(
          `/sso/authorize?response_type=${req.query["response_type"]}&client_id=${req.query["client_id"]}&redirect_url=${redirectUrl}`
        );
      }
    }
    return res.status(400).send({ message: "Invalid client" });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const renderLoginView = (req: Request, res: Response, next: NextFunction) => {
  const query = url.parse(req.url, true).query;
  return res.render("login", {
    title: "SSO Server | Sign in",
    responseType: query["response_type"],
    clientId: query["client_id"],
    redirectUrl: query["redirect_url"],
  });
};

const signin = async (req: Request, res: Response) => {
  if (req.body) {
    const { email, password, clientId, redirectUrl } = req.body;

    if (redirectUrl === null) {
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
            clientId,
            redirectUrl
          );
          authHelper.storeClientInCache(redirectUrl, result.userID, code);

          // redirect to client with an authorization token
          return res.redirect(302, redirectUrl + `?authorization_code=${code}`);
        }
        return res
          .status(404)
          .send({ success: false, message: "User not found" });
      }
    );
  } else {
    return res.status(404).send({ success: false, message: "User not found" });
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

export default { onAuthorize, renderLoginView, signin, onGetToken };
