"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../configs/connection"));
class SessionModel extends sequelize_1.Model {
}
SessionModel.init({
    sessionID: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    token: sequelize_1.DataTypes.STRING,
    expiredAt: sequelize_1.DataTypes.DATE,
}, {
    updatedAt: false,
    tableName: "sessions",
    sequelize: connection_1.default,
});
// UserModel.hasMany(dbHelper.sequelize.models.SessionModel, {
//   foreignKey: "user_pk",
// });
exports.default = SessionModel;
