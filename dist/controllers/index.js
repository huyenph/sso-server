"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url = __importStar(require("url"));
const auth_helper_1 = __importDefault(require("../helpers/auth.helper"));
const AUTH_HEADER = "authorization";
const BEARER_AUTH_SCHEME = "bearer";
const onAuthorize = (req, res, next) => {
    const redirectUrl = req.query["redirect_url"];
    try {
        if (typeof redirectUrl === "string") {
            const originUrl = new URL(redirectUrl).origin;
            if (originUrl) {
                if (!auth_helper_1.default.alloweOrigin[originUrl]) {
                    return res
                        .status(400)
                        .send({ message: "You are not allow to access SSO server" });
                }
                if (req.session.user !== undefined) {
                    const code = auth_helper_1.default.generateAuthorizationCode(req.session.user.id, redirectUrl);
                    auth_helper_1.default.storeClientInCache(redirectUrl, req.session.user.id, code);
                    // redirect to client with an authorization token
                    return res.redirect(302, redirectUrl + `?authorization_code=${code}`);
                }
                else {
                    return res.redirect(`/sso/authorize?response_type=${req.query["response_type"]}&client_id=${req.query["client_id"]}&redirect_url=${redirectUrl}`);
                }
            }
        }
        return res.status(400).send({ message: "Invalid client" });
    }
    catch (error) {
        return res.status(400).send({ message: error });
    }
};
const renderLoginView = (req, res, next) => {
    const user = req.session.user || "unlogged";
    const query = url.parse(req.url, true).query;
    return res.render("login", {
        title: "SSO Server | Sign in",
        responseType: query["response_type"],
        clientId: query["client_id"],
        redirectUrl: query["redirect_url"],
    });
};
const onSignin = (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    const clientId = req.body.client_id;
    const redirectUrl = req.body.redirect_url;
    // dbHelper.checkCredential(username, password, (user: UserType) => {
    //   // create global session here
    //   req.session.user = user;
    //   (authHelper.sessionUser as any)[user.userId] = user;
    //   if (redirectUrl === null) {
    //     return res.redirect("/");
    //   }
    //   // create authorization token
    //   const code = authHelper.generateAuthorizationCode(clientId, redirectUrl);
    //   authHelper.storeClientInCache(redirectUrl, user.userId, code);
    //   // redirect to client with an authorization token
    //   res.redirect(302, redirectUrl + `?authorization_code=${code}`);
    // });
};
const onToken = (req, res) => {
    if (req.body) {
        const { authorization_code, client_id, client_secret, redirect_url } = req.body;
        if (!auth_helper_1.default.authenticateClient(client_id, client_secret)) {
            return res.status(400).send({ message: "Invalid client" });
        }
        if (!auth_helper_1.default.verifyAuthorizationCode(req.get("Authorization"), authorization_code, client_id, redirect_url)) {
            return res.status(400).send({ message: "Access denied" });
        }
        const token = auth_helper_1.default.generateAccessToken(authorization_code, client_id, client_secret);
        return res.status(200).send({
            access_token: token,
            token_type: "JWT",
        });
    }
    else {
        return res.status(400).send({ message: "Invalid request" });
    }
};
exports.default = { onAuthorize, renderLoginView, onSignin, onToken };
