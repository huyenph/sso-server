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
    token: DataTypes.STRING,
    expiredAt: DataTypes.DATE,
  },
  {
    updatedAt: false,
    tableName: "sessions",
    sequelize: connection,
  }
);

// UserModel.hasMany(dbHelper.sequelize.models.SessionModel, {
//   foreignKey: "user_pk",
// });

export default SessionModel;
