const dotenv = require('dotenv');


dotenv.config({ path: `${__dirname}/../../.env`});
dotenv.config({ path: `${__dirname}/../../mysql.env`});

const { DEV_DB_NAME, DEV_DB_USER, DEV_DB_PASSWORD, DEV_DB_HOST, SERVER_PORT } = process.env;
const { MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST } = process.env;
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, PASS_RESET_TOKEN_SECRET } = process.env;
const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = process.env;
const { EMAIL_ADDRESS, EMAIL_PASSWORD } = process.env;

const isDevMode = () => process.env.NODE_ENV !== 'production';


module.exports = {
    serverPort: SERVER_PORT,
    host: isDevMode() ? DEV_DB_HOST : MYSQL_HOST,
    database: isDevMode() ? DEV_DB_NAME : MYSQL_DATABASE,
    username: isDevMode() ? DEV_DB_USER : MYSQL_USER,
    password: isDevMode() ? DEV_DB_PASSWORD : MYSQL_PASSWORD,
    cacheHost: isDevMode() ? 'localhost' : 'redis',
    accessTokenSecret: ACCESS_TOKEN_SECRET,
    refreshTokenSecret: REFRESH_TOKEN_SECRET,
    passResetTokenSecret: PASS_RESET_TOKEN_SECRET,
    cloudName: CLOUD_NAME,
    cloudApiKey: CLOUD_API_KEY,
    cloudApiSecret: CLOUD_API_SECRET,
    emailAddress: EMAIL_ADDRESS,
    emailPassword: EMAIL_PASSWORD
};