const dotenv = require('dotenv');


dotenv.config({ path: `${__dirname}/../../.env`});
dotenv.config({ path: `${__dirname}/../../mysql.env`});

const { DEV_DB_NAME, DEV_DB_USER, DEV_DB_PASSWORD, DEV_DB_HOST, SERVER_PORT } = process.env;
const { MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST } = process.env;
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, PASS_RESET_TOKEN_SECRET } = process.env;
const { DEV_CLOUD_NAME, DEV_CLOUD_API_KEY, DEV_CLOUD_API_SECRET } = process.env;
const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = process.env;
const { EMAIL_ADDRESS, EMAIL_PASSWORD, PYTHON_VENV_ACTIVATE_LOCATION } = process.env;

const isDevMode = () => process.env.NODE_ENV !== 'production';


module.exports = {
    serverPort: SERVER_PORT,
    host: isDevMode() ? DEV_DB_HOST : MYSQL_HOST,
    database: isDevMode() ? DEV_DB_NAME : MYSQL_DATABASE,
    username: isDevMode() ? DEV_DB_USER : MYSQL_USER,
    password: isDevMode() ? DEV_DB_PASSWORD : MYSQL_PASSWORD,
    cacheHost: isDevMode() ? 'localhost' : 'redis',
    python: isDevMode() ? PYTHON_VENV_ACTIVATE_LOCATION : 'python3',
    accessTokenSecret: ACCESS_TOKEN_SECRET,
    refreshTokenSecret: REFRESH_TOKEN_SECRET,
    passResetTokenSecret: PASS_RESET_TOKEN_SECRET,
    cloudName: isDevMode() ? DEV_CLOUD_NAME : CLOUD_NAME,
    cloudApiKey: isDevMode() ? DEV_CLOUD_API_KEY : CLOUD_API_KEY,
    cloudApiSecret: isDevMode() ? DEV_CLOUD_API_SECRET : CLOUD_API_SECRET,
    emailAddress: EMAIL_ADDRESS,
    emailPassword: EMAIL_PASSWORD
};