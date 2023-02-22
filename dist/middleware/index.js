"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_helper_1 = __importDefault(require("../helpers/auth.helper"));
const isAuthenticated = (req, res, next) => {
    const serviceURL = req.query["serviceURL"];
    if (req.session.user === undefined || req.session.user === null) {
        return res.redirect(`/sso/login?responseType=${req.query["responseType"]}&clientID=${req.query["clientID"]}&serviceURL=${serviceURL}`);
    }
    next();
};
const login = (req, res, next) => {
    const serviceURL = req.query["serviceURL"];
    if (serviceURL === null || serviceURL === undefined) {
        return res.redirect("/");
    }
    try {
        if (typeof serviceURL === "string") {
            const originUrl = new URL(serviceURL).origin;
            if (originUrl) {
                if (!auth_helper_1.default.allowOrigin[originUrl]) {
                    return res
                        .status(400)
                        .send({ message: "You are not allow to access SSO-Server" });
                }
                if (req.session.user !== undefined) {
                    const code = auth_helper_1.default.generateAuthorizationCode(req.session.user.id, serviceURL);
                    auth_helper_1.default.storeClientInCache(serviceURL, req.session.user.id, code);
                    // redirect to client with an authorization token
                    return res.redirect(302, `${serviceURL}?authorizationCode=${code}`);
                }
                next();
            }
        }
        return res.redirect("/");
    }
    catch (error) {
        return res.redirect("/");
    }
};
exports.default = { isAuthenticated, login };
