import CryptoJS from "crypto-js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { genJwtToken } from "./jwt.helper";

dotenv.config();

const sessionUser = <object>{};
const sessionClient = <object>{};
var intermediateTokenCache = <object>{};

const originName: OriginNameType = {
  "http://localhost:3000": "client_1",
  "http://localhost:3002": "client_2",
};

const alloweOrigin: AllowOriginType = {
  "http://localhost:3000": true,
  "http://localhost:3002": true,
};

const appTokenDB = {
  client_1: "l1Q7zkOL59cRqWBkQ12ZiGVW2DBL",
  client_2: "1g0jJwGmRQhJwvwNOrY4i90kD0m",
};

const secretKey = process.env.SECRET_KEY || "up9E5FC6TIwBDHadHAcLA7M3XeilqRfa";

const generateAuthorizationCode = (clientId: string, redirectUrl: string) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify({
      client_id: clientId,
      redirect_url: redirectUrl,
      exp: Date.now() + 600,
    }),
    secretKey
  ).toString();
};

const authenticateClient = (clientId: string, clientSecret: string) => {
  // check credential here
  return true;
};

const verifyAuthorizationCode = (
  bearerCode: string,
  authCode: string,
  clientId: string,
  redirectUrl: string
) => {
  const ssoCode = authCode.replace(/\s/g, "+");
  const clientName = (intermediateTokenCache as any)[ssoCode][1];
  const globalSessionToken = (intermediateTokenCache as any)[ssoCode][0];

  // console.log(bearerCode);
  // console.log((appTokenDB as any)[clientName]);

  if (bearerCode.replace("Bearer ", "") !== (appTokenDB as any)[clientName]) {
    return false;
  }

  if (authCode === undefined) {
    return false;
  }

  if (!(sessionClient as any)[globalSessionToken].includes(clientName)) {
    return false;
  }

  const authData = JSON.parse(
    CryptoJS.AES.decrypt(ssoCode, secretKey).toString(CryptoJS.enc.Utf8)
  );
  if (authData) {
    const { client_id, redirect_url, exp } = authData;
    if (clientId !== client_id || redirect_url !== redirectUrl) {
      return false;
    }
    if (exp < Date.now()) {
      return false;
    }
    return true;
  }
  return false;
};

const generateAccessToken = (
  authCode: string,
  clientId: string,
  clientSecret: string
) => {
  const ssoCode: string = authCode.replace(/\s/g, "+");
  const globalSessionToken: string = (intermediateTokenCache as any)[
    ssoCode
  ][0];
  const userInfo: UserType = (sessionUser as any)[globalSessionToken];
  return genJwtToken({
    client_id: clientId,
    client_secret: clientSecret,
    user: userInfo,
  });
};

const storeClientInCache = (
  redirectUrl: string,
  userId: string,
  token: string
) => {
  const originUrl: string = new URL(redirectUrl).origin;
  if ((sessionClient as any)[userId] === undefined) {
    (sessionClient as any)[userId] = [(originName as any)[originUrl]];
  } else {
    const clients: object[] = [...(sessionClient as any)[userId]];
    clients.push((originName as any)[originUrl]);
    (sessionClient as any)[userId] = clients;
  }
  intermediateTokenCache = {
    ...intermediateTokenCache,
    [token]: [userId, (originName as any)[originUrl]],
  };
};

export default {
  sessionUser,
  sessionClient,
  intermediateTokenCache,
  originName,
  alloweOrigin,
  authenticateClient,
  verifyAuthorizationCode,
  generateAuthorizationCode,
  generateAccessToken,
  storeClientInCache,
};
