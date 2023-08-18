const Redis = require('redis');


const redisClient = Redis.createClient();

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