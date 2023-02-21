"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const sequelize_1 = require("sequelize");
const userModel = (sequelize) => {
    return sequelize.define("Users", {
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
    });
};
exports.userModel = userModel;
