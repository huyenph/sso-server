"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_helper_1 = __importDefault(require("../helpers/auth.helper"));
const db_helper_1 = __importDefault(require("../helpers/db.helper"));
const AUTH_HEADER = "authorization";
const BEARER_AUTH_SCHEME = "bearer";
const onInit = (req, res, next) => {
    const query = req.query["redirect_url"];
    try {
        if (typeof query === "string") {
            const originUrl = new URL(query).origin;
            if (originUrl) {
                if (!auth_helper_1.default.alloweOrigin[originUrl]) {
                    return res
                        .status(400)
                        .send({ message: "You are not allow to access SSO server" });
                }
                if (req.session.user !== undefined) {
                    const code = auth_helper_1.default.generateAuthorizationCode(req.session.user.id, query);
                    auth_helper_1.default.storeClientInCache(query, req.session.user.id, code);
                    // redirect to client with an authorization token
                    res.redirect(302, query + `?authorization_code=${code}`);
                }
                else {
                    res.redirect("/oauth/authorize");
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
    return res.render("login", {
        title: "SSO Server | Sign in",
    });
};
const onSignin = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const clientId = req.body.client_id;
    const redirectUrl = req.body.redirect_url;
    db_helper_1.default.checkCredential(username, password, (user) => {
        // create global session here
        req.session.user = user;
        auth_helper_1.default.sessionUser[user.userId] = user;
        if (redirectUrl === null) {
            return res.redirect("/");
        }
        // create authorization token
        const code = auth_helper_1.default.generateAuthorizationCode(clientId, redirectUrl);
        auth_helper_1.default.storeClientInCache(redirectUrl, user.userId, code);
        // redirect to client with an authorization token
        res.redirect(302, redirectUrl + `?authorization_code=${code}`);
    });
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
exports.default = { onInit, renderLoginView, onSignin, onToken };
