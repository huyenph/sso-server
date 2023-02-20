"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateCert = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const privateKeyPath = process.env.JWT_PRIVATE_KEY_FILE ||
    path_1.default.resolve(__dirname, "./jwtPrivate.pem");
exports.privateCert = fs_1.default.readFileSync(privateKeyPath);
