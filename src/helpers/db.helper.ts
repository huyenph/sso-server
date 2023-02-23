import bcrypt from "bcrypt";
import mysql from "mysql2";
import connection from "../configs/connection";
import UserModel from "../models/user.model";

const authenticate = async () => {
  try {
    await connection.authenticate();
  } catch (error) {
    throw error;
  }
};

// Synchronizing all models at once
const syncAllModels = async () => {};

const insertUser = async (
  username: string,
  password: string,
  email: string,
  isActive: boolean,
  role: UserRole
) => {
  bcrypt.genSalt(10, (err: any, salt: any) => {
    bcrypt.hash(password, salt, async (err: any, hash: string) => {
      // connection.query(
      //   "INSERT INTO Users (userID, username, password, email, role) VALUES (?,?,?,?,?)",
      //   [userID, username, hash, email, role],
      //   (err: any, results: any, fields: any) => {}
      // );
      // await UserModel.create({
      //   username: username,
      //   password: hash,
      //   email: email,
      //   isActive: isActive,
      //   role: role,
      // });
    });
  });
};

const checkCredential = async (
  email: string,
  password: string,
  callback: (result: UserType | undefined) => void
): Promise<any> => {
  // const user = await sequelize.models.UserModel.users.findOne({
  //   where: { email: email },
  // });
  // if (user !== null) {
  //   bcrypt.compare(
  //     password,
  //     user.password,
  //     (_: Error | undefined, isMatch: boolean) => {
  //       if (isMatch) {
  //         return callback(user);
  //       }
  //       return callback(undefined);
  //     }
  //   );
  // }
  // connection.query(
  //   `SELECT * FROM Users WHERE username = "${username}"`,
  //   (err: any, results: any, fields: any) => {
  //     if (results.length > 0) {
  //       bcrypt.compare(
  //         password,
  //         results[0]["password"],
  //         (err: any, result: any) => {
  //           if (result) {
  //             const user: UserType = {
  //               userId: results[0]["userID"],
  //               username: results[0]["username"],
  //               email: results[0]["email"],
  //               role: results[0]["role"],
  //             };
  //             callback(user);
  //           }
  //         }
  //       );
  //     }
  //   }
  // );
};

export default {
  // sequelize,
  // mysqlDB,
  authenticate,
  syncAllModels,
  insertUser,
  checkCredential,
};
