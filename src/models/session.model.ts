import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreateOptions,
} from "sequelize";
import connection from "../configs/connection";
import UserModel from "./user.model";

class SessionModel extends Model<
  InferAttributes<SessionModel>,
  InferCreationAttributes<SessionModel>
> {
  declare sessionID: CreateOptions<number>;
  declare userID: number;
  declare token: string;
  declare readonly createdAt?: Date;
  declare readonly expiredAt?: Date;
}

SessionModel.init(
  {
    sessionID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userID: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "userID",
      },
    },
    token: DataTypes.STRING,
    expiredAt: DataTypes.DATE,
  },
  {
    updatedAt: false,
    tableName: "sessions",
    sequelize: connection,
  }
);

// UserModel.belongsTo(UserModel, { foreignKey: "user_pk" });

export default SessionModel;
