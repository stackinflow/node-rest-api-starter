require("dotenv").config();
const env = process.env.NODE_ENV || dev;
// 'dev' or 'test' or 'prod'

const dev = {
  name: "dev",
  app: {
    port: process.env.PORT || 9000,
  },
};

const test = {
  name: "test",
  app: {
    port: process.env.PORT || 9000,
  },
};

const prod = {
  name: "prod",
  app: {
    port: process.env.PORT || 9000,
  },
};

const config = {
  dev,
  test,
  prod,
};

module.exports = config[env] || config["dev"];
