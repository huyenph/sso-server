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
exports.findUser = exports.insertUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../models/user.model"));
const insertUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    bcrypt_1.default.genSalt(10, (err, salt) => {
        bcrypt_1.default.hash(payload.password, salt, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
            yield user_model_1.default.create(Object.assign(Object.assign({}, payload), { password: hash }));
        }));
    });
});
exports.insertUser = insertUser;
const findUser = (email, password, callback) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        where: { email: email },
    });
    if (user !== null) {
        bcrypt_1.default.compare(password, user.password, (_, isMatch) => {
            if (isMatch) {
                return callback(user);
            }
            return callback(undefined);
        });
    }
});
exports.findUser = findUser;
