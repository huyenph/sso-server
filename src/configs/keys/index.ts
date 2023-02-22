import fs from "fs";
import path from "path";

const privateKeyPath =
  process.env.JWT_PRIVATE_KEY_FILE || path.resolve(__dirname, "./jwtRS256.key");

export const privateCert = fs.readFileSync(privateKeyPath);
