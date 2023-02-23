import {
  Sequelize,
  DataTypes,
  Model,
  Optional,
  InferAttributes,
  InferCreationAttributes,
  CreateOptions,
} from "sequelize";
import connection from "../configs/connection";

class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare userID: CreateOptions<number>;
  declare username: string;
  declare password: string;
  declare email: string;
  declare isActive: boolean;
  declare role: UserRole;
  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;
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
  },
  {
    tableName: "users",
    sequelize: connection,
  }
);

// UserModel.hasMany(dbHelper.sequelize.models.SessionModel, {
//   foreignKey: "user_pk",
// });

export default UserModel;

// const userModel = dbHelper.sequelize.define(
//   "Users",
//   {
//     userID: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     username: DataTypes.STRING,
//     password: DataTypes.STRING,
//     email: DataTypes.STRING,
//     isActive: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: true,
//     },
//     role: {
//       type: DataTypes.ENUM,
//       values: [
//         "admin",
//         "manager",
//         "developer",
//         "finance",
//         "sales",
//         "marketing",
//         "user",
//       ],
//       defaultValue: "user",
//     },
//   },
//   {
//     tableName: "users",
//   }
// );

// userModel.hasMany(SessionModel.sessionModel, { foreignKey: "user_pk" });

// export default { userModel };
