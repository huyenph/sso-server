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
const bcrypt_1 = __importDefault(require("bcrypt"));
const connection_1 = __importDefault(require("../configs/connection"));
const user_model_1 = __importDefault(require("../models/user.model"));
const authenticate = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connection_1.default.authenticate();
    }
    catch (error) {
        throw error;
    }
});
// Synchronizing all models at once
const syncAllModels = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_model_1.default.sync();
    }
    catch (error) {
        throw error;
    }
});
const insertUser = (username, password, email, isActive, role) => __awaiter(void 0, void 0, void 0, function* () {
    bcrypt_1.default.genSalt(10, (err, salt) => {
        bcrypt_1.default.hash(password, salt, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
            // connection.query(
            //   "INSERT INTO Users (userID, username, password, email, role) VALUES (?,?,?,?,?)",
            //   [userID, username, hash, email, role],
            //   (err: any, results: any, fields: any) => {}
            // );
            yield connection_1.default.models.UserModel.create({
                username: username,
                password: hash,
                email: email,
                isActive: isActive,
                role: role,
            });
        }));
    });
});
const checkCredential = (email, password, callback) => __awaiter(void 0, void 0, void 0, function* () {
    // const user = await sequelize.models.UserModel.users.findOne({
    //   where: { email: email },
    // });
    // if (user !== null) {
    //   bcrypt.compare(
    //     password,
    //     user.password,
    //     (_: Error | undefined, isMatch: boolean) => {
    //       if (isMatch) {
    //         return callback(user);
    //       }
    //       return callback(undefined);
    //     }
    //   );
    // }
    // connection.query(
    //   `SELECT * FROM Users WHERE username = "${username}"`,
    //   (err: any, results: any, fields: any) => {
    //     if (results.length > 0) {
    //       bcrypt.compare(
    //         password,
    //         results[0]["password"],
    //         (err: any, result: any) => {
    //           if (result) {
    //             const user: UserType = {
    //               userId: results[0]["userID"],
    //               username: results[0]["username"],
    //               email: results[0]["email"],
    //               role: results[0]["role"],
    //             };
    //             callback(user);
    //           }
    //         }
    //       );
    //     }
    //   }
    // );
});
exports.default = {
    // sequelize,
    // mysqlDB,
    authenticate,
    syncAllModels,
    insertUser,
    checkCredential,
};
