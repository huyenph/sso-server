"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_js_1 = __importDefault(require("crypto-js"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const keys_1 = require("../configs/keys");
dotenv_1.default.config();
let sessionUser = {};
let sessionClient = {};
let intermediateTokenCache = {};
const originName = {
    "http://localhost:3000": "client_1",
    "http://localhost:3002": "client_2",
};
const allowOrigin = {
    "http://localhost:3000": true,
    "http://localhost:3002": true,
};
const appTokenDB = {
    client_1: "l1Q7zkOL59cRqWBkQ12ZiGVW2DBL",
    client_2: "1g0jJwGmRQhJwvwNOrY4i90kD0m",
};
const secretKey = process.env.SECRET_KEY || "up9E5FC6TIwBDHadHAcLA7M3XeilqRfa";
const generateAuthorizationCode = (clientId, redirectUrl) => {
    return crypto_js_1.default.AES.encrypt(JSON.stringify({
        client_id: clientId,
        redirect_url: redirectUrl,
        exp: Date.now() + 600,
    }), secretKey).toString();
};
const authenticateClient = (clientId, clientSecret) => {
    // check credential here
    return true;
};
const verifyAuthorizationCode = (bearerCode, authCode, clientId, redirectUrl) => {
    if (authCode === undefined) {
        return false;
    }
    const ssoCode = authCode.replace(/\s/g, "+");
    const clientName = intermediateTokenCache[ssoCode][1];
    const globalSessionToken = intermediateTokenCache[ssoCode][0];
    if (bearerCode.replace("Bearer ", "") !== appTokenDB[clientName]) {
        console.log(bearerCode.replace("Bearer ", ""));
        console.log(appTokenDB[clientName]);
        return false;
    }
    if (sessionClient === undefined) {
        return false;
    }
    if (!sessionClient[globalSessionToken].includes(clientName)) {
        return false;
    }
    const authData = JSON.parse(crypto_js_1.default.AES.decrypt(ssoCode, secretKey).toString(crypto_js_1.default.enc.Utf8));
    if (authData) {
        console.log(`authData: ${authData}`);
        const { client_id, redirect_url, exp } = authData;
        if (clientId !== client_id || redirect_url !== redirectUrl) {
            return false;
        }
        if (exp < Date.now()) {
            return false;
        }
        return true;
    }
    return false;
};
const generateAccessToken = (authCode, clientId, clientSecret) => {
    const ssoCode = authCode.replace(/\s/g, "+");
    const globalSessionToken = intermediateTokenCache[ssoCode][0];
    const userInfo = sessionUser[globalSessionToken];
    return jsonwebtoken_1.default.sign({
        client_id: clientId,
        client_secret: clientSecret,
        user: userInfo,
    }, keys_1.privateCert, {
        algorithm: "RS256",
        expiresIn: "1h",
        issuer: "sso-server",
    });
    // const token = jwtHelper.genJwtToken({
    //   client_id: clientId,
    //   client_secret: clientSecret,
    //   user: userInfo,
    // });
    // console.log(token);
    // return token;
};
const storeClientInCache = (redirectUrl, userId, token) => {
    const originUrl = new URL(redirectUrl).origin;
    if (sessionClient[userId] === undefined) {
        sessionClient[userId] = [originName[originUrl]];
    }
    else {
        const clients = [...sessionClient[userId]];
        clients.push(originName[originUrl]);
        sessionClient[userId] = clients;
    }
    intermediateTokenCache = Object.assign(Object.assign({}, intermediateTokenCache), { [token]: [userId, originName[originUrl]] });
};
exports.default = {
    sessionUser,
    sessionClient,
    intermediateTokenCache,
    originName,
    allowOrigin,
    authenticateClient,
    verifyAuthorizationCode,
    generateAuthorizationCode,
    generateAccessToken,
    storeClientInCache,
};
