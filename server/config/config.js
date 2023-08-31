const processEnv = require('./env');
const { username, password, database, host } = processEnv;

module.exports = {
  development: {
    username: username,
    password: password,
    database: database,
    host: host,
    dialect: "mysql"
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: username,
    password: password,
    database: database,
    host: host,
    dialect: "mysql"
  }
}
