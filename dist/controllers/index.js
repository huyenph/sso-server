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
const user_db_1 = require("../data/user.db");
const onAuthorized = (req, res, next) => {
    const serviceURL = req.query["serviceURL"];
    if (serviceURL === null || serviceURL === undefined) {
        return res.redirect("/");
    }
    if (req.session.user !== undefined) {
        const code = auth_helper_1.default.generateAuthorizationCode(req.session.user.id, req.query["clientID"], serviceURL);
        auth_helper_1.default.storeClientInCache(serviceURL, req.session.user.id, code);
        // redirect to client with an authorization token
        return res.redirect(302, `${serviceURL}?authorizationCode=${code}`);
    }
};
const renderLoginView = (req, res, next) => {
    const query = url.parse(req.url, true).query;
    return res.render("login", {
        title: "SSO Server | Sign in",
        responseType: query["responseType"],
        clientID: query["clientID"],
        serviceURL: query["serviceURL"],
    });
};
const onLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body) {
        const { email, password, clientID, serviceURL } = req.body;
        if (serviceURL === null) {
            return res.redirect("/");
        }
        (0, user_db_1.findUser)(email, password, (result) => {
            if (result !== undefined) {
                // create global session here
                req.session.user = Object.assign(Object.assign({}, result), { password: undefined });
                auth_helper_1.default.sessionUser[`${result.userID}`] = result;
                // create authorization token
                const code = auth_helper_1.default.generateAuthorizationCode(result.userID, clientID, serviceURL);
                // save authentication token to database
                auth_helper_1.default.storeClientInCache(serviceURL, `${result.userID}`, code);
                // redirect to client with an authorization token
                return res.redirect(302, `${serviceURL}?authorizationCode=${code}`);
            }
            else {
                return res
                    .status(404)
                    .send({ success: false, message: "User not found" });
            }
        });
    }
    else {
        return res.redirect("/");
    }
});
const onGetToken = (req, res) => {
    if (req.body) {
        const { authorizationCode, clientID, clientSecret, serviceURL } = req.body;
        if (!auth_helper_1.default.authenticateClient(clientID, clientSecret)) {
            return res.status(400).send({ message: "Invalid client" });
        }
        if (!auth_helper_1.default.verifyAuthorizationCode(req.get("Authorization"), authorizationCode, clientID, serviceURL)) {
            return res.status(400).send({ message: "Access denied" });
        }
        const token = auth_helper_1.default.generateAccessToken(authorizationCode, clientID, clientSecret);
        res.status(200).send({
            accessToken: token,
            tokenType: "JWT",
        });
    }
    else {
        return res.status(400).send({ message: "Invalid request" });
    }
};
exports.default = { onAuthorized, renderLoginView, onLogin, onGetToken };
