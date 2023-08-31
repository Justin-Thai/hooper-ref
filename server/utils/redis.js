const Redis = require('redis');
const processEnv = require('../config/env');

const { cacheHost } = processEnv;
const redisClient = Redis.createClient({ url: `redis://${cacheHost}:6379` });

(async () => {
    redisClient.on('connect', () => {
        console.log('Connected to Redis instance');
    });
    
    redisClient.on('error', (error) => {
        console.error('Redis Client Error', error);
    });

    await redisClient.connect();
})();


module.exports = redisClient;