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
const mysql2_1 = __importDefault(require("mysql2"));
const configs_1 = __importDefault(require("../configs"));
const { Sequelize } = require("sequelize");
const dbConfig = configs_1.default.dbConfig;
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, dbConfig.options);
const connection = mysql2_1.default.createPool(configs_1.default.mysqlConfig);
const mysqlDB = {
    sequelize: sequelize,
};
const authenticate = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
    }
    catch (error) {
        throw error;
    }
});
// Synchronizing all models at once
const syncAllModels = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mysqlDB.sequelize.sync();
    }
    catch (error) {
        throw error;
    }
});
const insertUser = (userID, username, password, email, role) => {
    bcrypt_1.default.genSalt(10, (err, salt) => {
        bcrypt_1.default.hash(password, salt, (err, hash) => {
            connection.query("INSERT INTO Users (userID, username, password, email, role) VALUES (?,?,?,?,?)", [userID, username, hash, email, role], (err, results, fields) => { });
        });
    });
};
const checkCredential = (username, password, callback) => {
    connection.query(`SELECT * FROM Users WHERE username = "${username}"`, (err, results, fields) => {
        if (results.length > 0) {
            bcrypt_1.default.compare(password, results[0]["password"], (err, result) => {
                if (result) {
                    const user = {
                        userId: results[0]["userID"],
                        username: results[0]["username"],
                        email: results[0]["email"],
                        role: results[0]["role"],
                    };
                    callback(user);
                }
            });
        }
    });
};
exports.default = { mysqlDB, authenticate, syncAllModels, checkCredential };
