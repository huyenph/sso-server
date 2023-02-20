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

export default { mysqlDB, authenticate, syncAllModels };
