import fs from "fs";
import path from "path";

const privateKeyPath =
  process.env.JWT_PRIVATE_KEY_FILE ||
  path.resolve(__dirname, "./jwtPrivate.pem");

export const privateCert = fs.readFileSync(privateKeyPath);
