"use strict";
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
exports.initAllModels = exports.authenticate = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const connection_1 = __importDefault(require("../configs/connection"));
const user_model_1 = __importDefault(require("../models/user.model"));
const session_model_1 = __importDefault(require("../models/session.model"));
dotenv_1.default.config();
const isDev = process.env.NODE_ENV === "development";
const authenticate = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connection_1.default.authenticate();
    }
    catch (error) {
        throw error;
    }
});
exports.authenticate = authenticate;
const initAllModels = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_model_1.default.sync({ alter: isDev });
        yield session_model_1.default.sync({ alter: isDev });
    }
    catch (error) {
        throw error;
    }
});
exports.initAllModels = initAllModels;
