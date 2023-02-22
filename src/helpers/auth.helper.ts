import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { privateCert } from "../configs/keys";

dotenv.config();

let sessionUser: SessionUserType = {};
let sessionClient: SessionClientType = {};
let intermediateTokenCache: IntermediateTokenCacheType = {};

const originName: OriginNameType = {
  "http://localhost:3000": "client_1",
  "http://localhost:3002": "client_2",
};

const allowOrigin: AllowOriginType = {
  "http://localhost:3000": true,
  "http://localhost:3002": true,
};

const appTokenDB: AppTokenDBType = {
  client_1: "l1Q7zkOL59cRqWBkQ12ZiGVW2DBL",
  client_2: "1g0jJwGmRQhJwvwNOrY4i90kD0m",
};

const secretKey = process.env.SECRET_KEY || "up9E5FC6TIwBDHadHAcLA7M3XeilqRfa";

const generateAuthorizationCode = (clientId: string, redirectUrl: string) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify({
      clientID: clientId,
      serviceURL: redirectUrl,
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
  serviceUrl: string
) => {
  if (authCode === undefined) {
    return false;
  }

  const ssoCode: string = authCode.replace(/\s/g, "+");
  const clientName: string = intermediateTokenCache[ssoCode][1];
  const globalSessionToken: string = intermediateTokenCache[ssoCode][0];

  if (bearerCode.replace("Bearer ", "") !== appTokenDB[clientName]) {
    return false;
  }

  if (sessionClient === undefined) {
    return false;
  }

  if (!sessionClient[globalSessionToken]!.includes(clientName)) {
    return false;
  }

  const authData = JSON.parse(
    CryptoJS.AES.decrypt(ssoCode, secretKey).toString(CryptoJS.enc.Utf8)
  );
  if (authData) {
    const { clientID, serviceURL, exp } = authData;
    if (clientId !== clientID || serviceURL !== serviceUrl) {
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
  const globalSessionToken: string = intermediateTokenCache[ssoCode][0];
  const userInfo: UserType = sessionUser[globalSessionToken];
  return jwt.sign(
    {
      clientID: clientId,
      clientSecret: clientSecret,
      user: userInfo,
    },
    privateCert,
    {
      algorithm: "RS256",
      expiresIn: "1h",
      issuer: "sso-server",
    }
  );
  // const token = jwtHelper.genJwtToken({
  //   client_id: clientId,
  //   client_secret: clientSecret,
  //   user: userInfo,
  // });
  // console.log(token);
  // return token;
};

const storeClientInCache = (
  redirectUrl: string,
  userId: string,
  token: string
) => {
  const originUrl: string = new URL(redirectUrl).origin;
  if (sessionClient[userId] === undefined) {
    sessionClient[userId] = [originName[originUrl]];
  } else {
    const clients: string[] = [...(sessionClient[userId] as string)];
    clients.push(originName[originUrl]);
    sessionClient[userId] = clients;
  }
  intermediateTokenCache = {
    ...intermediateTokenCache,
    [token]: [userId, originName[originUrl]],
  };
};

export default {
  sessionUser,
  sessionClient,
  intermediateTokenCache,
  originName,
  allowOrigin,
  authenticateClient,
  verifyAuthorizationCode,
  generateAuthorizationCode,
  generateAccessToken,
  storeClientInCache,
};
