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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url = __importStar(require("url"));
const auth_helper_1 = __importDefault(require("../helpers/auth.helper"));
const db_helper_1 = __importDefault(require("../helpers/db.helper"));
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
                return res.redirect(`/sso/authorize?response_type=${req.query["response_type"]}&client_id=${req.query["client_id"]}&redirect_url=${redirectUrl}`);
            }
        }
        return res.status(400).send({ message: "Invalid client" });
    }
    catch (error) {
        return res.status(400).send({ message: error });
    }
};
const renderLoginView = (req, res, next) => {
    const query = url.parse(req.url, true).query;
    return res.render("login", {
        title: "SSO Server | Sign in",
        responseType: query["response_type"],
        clientId: query["client_id"],
        redirectUrl: query["redirect_url"],
    });
};
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body) {
        const { email, password, clientId, redirectUrl } = req.body;
        if (redirectUrl === null) {
            return res.redirect("/");
        }
        db_helper_1.default.checkCredential(email, password, (result) => {
            if (result !== undefined) {
                // create global session here
                req.session.user = result;
                auth_helper_1.default.sessionUser[result.userID] = result;
                // create authorization token
                const code = auth_helper_1.default.generateAuthorizationCode(clientId, redirectUrl);
                auth_helper_1.default.storeClientInCache(redirectUrl, result.userID, code);
                // redirect to client with an authorization token
                return res.redirect(302, redirectUrl + `?authorization_code=${code}`);
            }
            return res
                .status(404)
                .send({ success: false, message: "User not found" });
        });
    }
    else {
        return res.status(404).send({ success: false, message: "User not found" });
    }
});
const onGetToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body) {
        const { authorization_code, client_id, client_secret, redirect_url } = req.body;
        if (!auth_helper_1.default.authenticateClient(client_id, client_secret)) {
            return res.status(400).send({ message: "Invalid client" });
        }
        if (!auth_helper_1.default.verifyAuthorizationCode(req.get("Authorization"), authorization_code, client_id, redirect_url)) {
            return res.status(400).send({ message: "Access denied" });
        }
        const token = yield auth_helper_1.default.generateAccessToken(authorization_code, client_id, client_secret);
        res.status(200).send({
            access_token: token,
            token_type: "JWT",
        });
    }
    else {
        console.log("error here");
        return res.status(400).send({ message: "Invalid request" });
    }
});
exports.default = { onAuthorize, renderLoginView, signin, onGetToken };
