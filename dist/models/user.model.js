"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../configs/connection"));
class UserModel extends sequelize_1.Model {
}
UserModel.init({
    userID: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: sequelize_1.DataTypes.STRING,
    password: sequelize_1.DataTypes.STRING,
    email: sequelize_1.DataTypes.STRING,
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    role: {
        type: sequelize_1.DataTypes.ENUM,
        values: [
            "admin",
            "manager",
            "developer",
            "finance",
            "sales",
            "marketing",
            "user",
        ],
        defaultValue: "user",
    },
}, {
    tableName: "users",
    sequelize: connection_1.default,
});
// UserModel.hasMany(dbHelper.sequelize.models.SessionModel, {
//   foreignKey: "user_pk",
// });
exports.default = UserModel;
