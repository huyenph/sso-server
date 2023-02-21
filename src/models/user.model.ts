import { Sequelize, DataTypes } from "sequelize";

export const userModel = (sequelize: Sequelize) => {
  return sequelize.define(
    "Users",
    {
      userID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      role: {
        type: DataTypes.ENUM,
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
    },
    {
      tableName: "users",
    }
  );
};
