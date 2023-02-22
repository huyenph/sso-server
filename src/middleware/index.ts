import { Request, Response, NextFunction } from "express";
import authHelper from "../helpers/auth.helper";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const serviceURL = req.query["serviceURL"];
  if (req.session.user === undefined || req.session.user === null) {
    return res.redirect(
      `/sso/login?responseType=${req.query["responseType"]}&clientID=${req.query["clientID"]}&serviceURL=${serviceURL}`
    );
  }
  next();
};

const login = (req: Request, res: Response, next: NextFunction) => {
  const serviceURL = req.query["serviceURL"] as string;
  if (serviceURL === null || serviceURL === undefined) {
    return res.redirect("/");
  }

  try {
    const originUrl = new URL(serviceURL).origin;
    if (originUrl) {
      if (!authHelper.allowOrigin[originUrl]) {
        return res
          .status(400)
          .send({ message: "You are not allow to access SSO-Server" });
      }
      if (req.session.user !== undefined) {
        const code = authHelper.generateAuthorizationCode(
          req.session.user.id,
          serviceURL
        );
        authHelper.storeClientInCache(serviceURL, req.session.user.id, code);
        // redirect to client with an authorization token
        return res.redirect(302, `${serviceURL}?authorizationCode=${code}`);
      }
      next();
    } else {
      return res.redirect("/");
    }
  } catch (error) {
    return res.redirect("/");
  }
};

export default { isAuthenticated, login };
