import dotenv from "dotenv";
import connection from "../configs/connection";
import UserModel from "../models/user.model";
import SessionModel from "../models/session.model";

dotenv.config();

const isDev = process.env.NODE_ENV === "development";

export const authenticate = async () => {
  try {
    await connection.authenticate();
  } catch (error) {
    throw error;
  }
};

export const initAllModels = async () => {
  try {
    await UserModel.sync({ alter: isDev });
    await SessionModel.sync({ alter: isDev });
  } catch (error) {
    throw error;
  }
};
