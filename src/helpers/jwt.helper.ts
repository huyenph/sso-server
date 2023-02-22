import jwt from "jsonwebtoken";
import { privateCert } from "../configs/keys";

const genJwtToken = (payload: any) => {
  new Promise((resolve: any, reject: any) => {
    jwt.sign(
      { ...payload },
      privateCert,
      {
        algorithm: "RS256",
        expiresIn: "1h",
        issuer: "sso-server",
      },
      (err: Error | null, token: string | undefined) => {
        if (err) {
          return reject(err);
        }
        return resolve(token);
      }
    );
  });
};

export default { genJwtToken };
