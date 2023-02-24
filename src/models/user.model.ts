import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import connection from "../configs/connection";

class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare userID: CreationOptional<number>;
  declare username: string;
  declare password: string;
  declare email: string;
  declare isActive: boolean;
  declare role: UserRole;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

UserModel.init(
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
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "users",
    sequelize: connection,
  }
);

export default UserModel;
