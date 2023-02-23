import dotenv from "dotenv";
import UserModel from "../models/user.model";
import SessionModel from "../models/session.model";

dotenv.config();

export const initAllModels = async () => {
  try {
    await UserModel.sync({ alter: process.env.NODE_ENV === "development" });
    await SessionModel.sync({ alter: process.env.NODE_ENV === "development" });
  } catch (error) {
    throw error;
  }
};
