import { Request, Response, NextFunction } from "express";
import * as url from "url";
import authHelper from "../helpers/auth.helper";
import { findUser } from "../data/user.db";
import UserModel from "../models/user.model";

const onAuthorized = (req: Request, res: Response, next: NextFunction) => {
  const serviceURL = req.query["serviceURL"] as string;
  if (serviceURL === null || serviceURL === undefined) {
    return res.redirect("/");
  }

  if (req.session.user !== undefined) {
    const code = authHelper.generateAuthorizationCode(
      req.session.user.id,
      req.query["clientID"] as string,
      serviceURL
    );
    authHelper.storeClientInCache(serviceURL, req.session.user.id, code);
    // redirect to client with an authorization token
    return res.redirect(302, `${serviceURL}?authorizationCode=${code}`);
  }
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

    findUser(email, password, (result: UserModel | undefined) => {
      if (result !== undefined) {
        // create global session here
        req.session.user = { ...result, password: undefined };
        authHelper.sessionUser[`${result.userID}`] = result;

        // create authorization token
        const code = authHelper.generateAuthorizationCode(
          result.userID,
          clientID,
          serviceURL
        );

        // save authentication token to database

        authHelper.storeClientInCache(serviceURL, `${result.userID}`, code);

        // redirect to client with an authorization token
        return res.redirect(302, `${serviceURL}?authorizationCode=${code}`);
      } else {
        return res
          .status(404)
          .send({ success: false, message: "User not found" });
      }
    });
  } else {
    return res.redirect("/");
  }
};

const onGetToken = (req: Request, res: Response) => {
  if (req.body) {
    const { authorizationCode, clientID, clientSecret, serviceURL } = req.body;

    if (!authHelper.authenticateClient(clientID, clientSecret)) {
      return res.status(400).send({ message: "Invalid client" });
    }

    if (
      !authHelper.verifyAuthorizationCode(
        req.get("Authorization")!,
        authorizationCode,
        clientID,
        serviceURL
      )
    ) {
      return res.status(400).send({ message: "Access denied" });
    }

    const token = authHelper.generateAccessToken(
      authorizationCode,
      clientID,
      clientSecret
    );
    res.status(200).send({
      accessToken: token,
      tokenType: "JWT",
    });
  } else {
    return res.status(400).send({ message: "Invalid request" });
  }
};

export default { onAuthorized, renderLoginView, onLogin, onGetToken };
