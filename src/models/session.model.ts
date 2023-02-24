import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreateOptions,
} from "sequelize";
import connection from "../configs/connection";

class SessionModel extends Model<
  InferAttributes<SessionModel>,
  InferCreationAttributes<SessionModel>
> {
  declare sessionID: CreateOptions<number>;
  declare userID: number;
  declare token: string;
  declare readonly createdAt: Date | null;
  declare readonly expiredAt: Date | null;
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
    createdAt: DataTypes.DATE,
    expiredAt: DataTypes.DATE,
  },
  {
    updatedAt: false,
    tableName: "sessions",
    sequelize: connection,
  }
);

export default SessionModel;
