import { Sequelize, Dialect } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const connection = new Sequelize(
  process.env.MYSQL_DB as string,
  process.env.MYSQL_USER as string,
  process.env.MYSQL_PASS,
  {
    host: process.env.MYSQL_HOST as string,
    dialect: process.env.DIALECT as Dialect,
    pool: {
      max: 20,
      min: 15,
      acquire: process.env.POOL_ACQUIRE as string,
      idle: process.env.POOL_IDLE as string,
    } as Object,
  }
);

const mysqlConfig = {
  host: process.env.HOST,
  database: process.env.DB,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
};

export default connection;
