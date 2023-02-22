"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const keys_1 = require("../configs/keys");
const genJwtToken = (payload) => {
    // new Promise((resolve: any, reject: any) => {
    return jsonwebtoken_1.default.sign(Object.assign({}, payload), keys_1.privateCert, {
        algorithm: "RS256",
        expiresIn: "1h",
        issuer: "sso-server",
    }
    // (err: any, token: any) => {
    //   return token;
    //   // if (err) {
    //   //   return reject(err);
    //   // }
    //   // return resolve(token);
    // }
    );
    // });
};
exports.default = { genJwtToken };
