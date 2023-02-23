import { Sequelize, DataTypes, Model } from "sequelize";
import dbHelper from "../helpers/db.helper";
import UserModel from "./user.model";

// class SessionModel extends Model {}

// SessionModel.init(
//   {
//     sessionID: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     token: DataTypes.STRING,
//     expiredAt: DataTypes.DATE,
//   },
//   {
//     tableName: "sessions",
//     sequelize: dbHelper.sequelize,
//   }
// );

// SessionModel.belongsTo(dbHelper.sequelize.models.UserModel, {
//   foreignKey: "user_pk",
// });

// export default new SessionModel();

// const sessionModel = dbHelper.sequelize.define(
//   "Sessions",
//   {
//     sessionID: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     token: DataTypes.STRING,
//     expiredAt: DataTypes.DATE,
//   },
//   {
//     updatedAt: false,
//     tableName: "session",
//   }
// );

// sessionModel.belongsTo(UserModel.userModel, {
//   foreignKey: "user_pk",
// });

// export default { sessionModel };
