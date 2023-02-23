import UserModel from "../models/user.model";

export const initAllModels = async () => {
  try {
    await UserModel.sync();
  } catch (error) {
    throw error;
  }
};
