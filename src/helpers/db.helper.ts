import bcrypt from "bcrypt";
import mysql from "mysql2";
import config from "../configs";

const { Sequelize } = require("sequelize");

type DatabaseType = {
  sequelize: typeof Sequelize;
};

const dbConfig = config.dbConfig;

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  dbConfig.options
);

const connection = mysql.createPool(config.mysqlConfig);

const mysqlDB: DatabaseType = {
  sequelize: sequelize,
};

const authenticate = async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    throw error;
  }
};

// Synchronizing all models at once
const syncAllModels = async () => {
  try {
    await mysqlDB.sequelize.sync();
  } catch (error) {
    throw error;
  }
};

const insertUser = (
  userID: string,
  username: string,
  password: string,
  email: string,
  role: UserRole
) => {
  bcrypt.genSalt(10, (err: any, salt: any) => {
    bcrypt.hash(password, salt, (err: any, hash: string) => {
      connection.query(
        "INSERT INTO Users (userID, username, password, email, role) VALUES (?,?,?,?,?)",
        [userID, username, hash, email, role],
        (err: any, results: any, fields: any) => {}
      );
    });
  });
};

const checkCredential = (
  username: string,
  password: string,
  callback: (userType: UserType) => void
) => {
  connection.query(
    `SELECT * FROM Users WHERE username = "${username}"`,
    (err: any, results: any, fields: any) => {
      if (results.length > 0) {
        bcrypt.compare(
          password,
          results[0]["password"],
          (err: any, result: any) => {
            if (result) {
              const user: UserType = {
                userId: results[0]["userID"],
                username: results[0]["username"],
                email: results[0]["email"],
                role: results[0]["role"],
              };
              callback(user);
            }
          }
        );
      }
    }
  );
};

export default { mysqlDB, authenticate, syncAllModels, checkCredential };
