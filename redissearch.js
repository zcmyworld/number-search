const redis = require('redis');

const Promise = require("bluebird");
const bluebird = require('bluebird');


const REDIS_KEY = 'phone';


bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);



let redisClient = redis.createClient({
  port: '7000',
  host: '127.0.0.1'
});



exports.search = async function (searchkey) {
  let prefix = `${searchkey}/`;
  let suffix = `${searchkey}:`;

  await redisClient.zaddAsync(REDIS_KEY, 0, prefix);
  await redisClient.zaddAsync(REDIS_KEY, 0, suffix);

  let prefixRank = await redisClient.zrankAsync(REDIS_KEY, prefix);
  let sufffixRank = await redisClient.zrankAsync(REDIS_KEY, suffix);

  let start = prefixRank + 1;
  let end = sufffixRank - 1;

  if (start + 10 < end) {
    end = start + 9;
  }

  let rs = await redisClient.zrangeAsync(REDIS_KEY, start, end);

  let remprefix = await redisClient.zremAsync(REDIS_KEY, prefix);
  let remsuffix = await redisClient.zremAsync(REDIS_KEY, suffix);

  return rs;

}