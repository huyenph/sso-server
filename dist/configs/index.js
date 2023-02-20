"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbConfig = {
    DB: process.env.MYSQL_DB,
    USER: process.env.MYSQL_USER,
    PASSWORD: process.env.MYSQL_PASS,
    options: {
        host: process.env.MYSQL_HOST,
        dialect: process.env.DIALECT,
        pool: {
            max: 20,
            min: 15,
            acquire: process.env.POOL_ACQUIRE,
            idle: process.env.POOL_IDLE,
        },
    },
};
exports.default = { dbConfig };
