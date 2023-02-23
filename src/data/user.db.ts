import bcrypt from "bcrypt";
import UserModel from "../models/user.model";

const insertUser = async (payload: UserModel) => {
  bcrypt.genSalt(10, (err: any, salt: any) => {
    bcrypt.hash(payload.password, salt, async (err: any, hash: string) => {
      await UserModel.create(<UserModel>{ ...payload, password: hash });
    });
  });
};

const findUser = async (
  email: string,
  password: string,
  callback: (result: UserModel | undefined) => void
) => {
  const user = await UserModel.findOne({
    where: { email: email },
  });
  if (user !== null) {
    bcrypt.compare(
      password,
      user.password,
      (_: Error | undefined, isMatch: boolean) => {
        if (isMatch) {
          return callback(user);
        }
        return callback(undefined);
      }
    );
  }
};

export { insertUser, findUser };
