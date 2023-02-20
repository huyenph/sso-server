import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  DB: process.env.MYSQL_DB,
  USER: process.env.MYSQL_USER,
  PASSWORD: process.env.MYSQL_PASS,
  options: {
    host: process.env.MYSQL_HOST,
    dialect: process.env.DIALECT,
    pool: {
      max: 20,
      min: 15,
      acquire: process.env.POOL_ACQUIRE,
      idle: process.env.POOL_IDLE,
    },
  },
};

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

export default { dbConfig, mysqlConfig };
