"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const keys_1 = require("../configs/keys");
const genJwtToken = (payload) => {
    new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign(Object.assign({}, payload), keys_1.privateCert, {
            algorithm: "RS256",
            expiresIn: "1h",
            issuer: "sso-server",
        }, (err, token) => {
            if (err) {
                return reject(err);
            }
            return resolve(token);
        });
    });
};
exports.genJwtToken = genJwtToken;
