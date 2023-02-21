"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_js_1 = __importDefault(require("crypto-js"));
const dotenv_1 = __importDefault(require("dotenv"));
const jwt_helper_1 = require("./jwt.helper");
dotenv_1.default.config();
let sessionUser = {};
let sessionClient = {};
let intermediateTokenCache = {};
const originName = {
    "http://localhost:3000": "client_1",
    "http://localhost:3002": "client_2",
};
const alloweOrigin = {
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
    const ssoCode = authCode.replace(/\s/g, "+");
    const clientName = intermediateTokenCache[ssoCode][1];
    const globalSessionToken = intermediateTokenCache[ssoCode][0];
    // console.log(bearerCode);
    // console.log((appTokenDB as any)[clientName]);
    if (bearerCode.replace("Bearer ", "") !== appTokenDB[clientName]) {
        return false;
    }
    if (authCode === undefined) {
        return false;
    }
    if (!sessionClient[globalSessionToken].includes(clientName)) {
        return false;
    }
    const authData = JSON.parse(crypto_js_1.default.AES.decrypt(ssoCode, secretKey).toString(crypto_js_1.default.enc.Utf8));
    if (authData) {
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
    return (0, jwt_helper_1.genJwtToken)({
        client_id: clientId,
        client_secret: clientSecret,
        user: userInfo,
    });
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
    console.log(sessionClient);
    console.log(intermediateTokenCache);
};
exports.default = {
    sessionUser,
    sessionClient,
    intermediateTokenCache,
    originName,
    alloweOrigin,
    authenticateClient,
    verifyAuthorizationCode,
    generateAuthorizationCode,
    generateAccessToken,
    storeClientInCache,
};
