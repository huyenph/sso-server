import bcrypt from "bcrypt";
import UserModel from "../models/user.model";

const insertUser = async (payload: UserModel) => {
  bcrypt.genSalt(10, (err: any, salt: any) => {
    bcrypt.hash(payload.password, salt, async (err: any, hash: string) => {
      // connection.query(
      //   "INSERT INTO Users (userID, username, password, email, role) VALUES (?,?,?,?,?)",
      //   [userID, username, hash, email, role],
      //   (err: any, results: any, fields: any) => {}
      // );
      await UserModel.create(<UserModel>{ ...payload, password: hash });
    });
  });
};

export { insertUser };
