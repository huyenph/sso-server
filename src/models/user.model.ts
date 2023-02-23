import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import dbHelper from "../helpers/db.helper";
import connection from "../configs/connection";
// import SessionModel from "./session.model";

interface UserModelAttributes {
  userID: number;
  username: string;
  password: string;
  email: string;
  isActive: boolean;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserModelInput extends Optional<UserModelAttributes, "userID"> {}

interface UserModelOutput extends Required<UserModelAttributes> {}

class UserModel
  extends Model<UserModelAttributes, UserModelInput>
  implements UserModelAttributes
{
  public userID!: number;
  public username!: string;
  public password!: string;
  public email!: string;
  public isActive!: boolean;
  public role!: UserRole;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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

// UserModel.sync();

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
