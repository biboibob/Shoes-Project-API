// const { createClient } = require("redis");
// let redisClient = createClient({
//   host: "localhost",
//   port: 6379,
//   legacyMode: true,
// });
require("dotenv").config();
// const redisClient = require("redis").createClient({
//   host: process.env.REDIS_HOST,
//   port: process.env.REDIS_PORT,
//   password: process.env.REDIS_PASSWORD,
// });
// const redisClient = require("redis").createClient();
// const RedisCon = redisClient(6379, "localhost")

// const redisCon = redisClient(6379, "localhost");

// const redis = require("redis");
const Redis = require("ioredis");
const redisClient = new Redis(process.env.REDIS_URL);

//get Redis Cache
function get(redis_key) {
  return new Promise(async (resolve) => {
    redisClient.get(redis_key, (err, reply) => {
      if (err) {
        console.log("Redis Conn Error", err);
      } else {
        console.log("Success Redis Get", redis_key);
        resolve({ reply });
      }
    });
  });
}

function set(redis_key, redis_value) {
  return new Promise(async (resolve) => {
    redisClient.set(redis_key, redis_value, (err, reply) => {
      if (err) {
        console.log("Redis Conn Error", err);
      } else {
        console.log("Success Redis Set", redis_key);
        resolve({ reply });
      }
    });
  });
}

module.exports = {
  get,
  set,
};
