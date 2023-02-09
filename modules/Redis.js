// const { createClient } = require("redis");
// let redisClient = createClient({
//   host: "localhost",
//   port: 6379,
//   legacyMode: true,
// });
require("dotenv").config();
const Utils = require("../utils/index");
// const redisClient = require("redis").createClient({
//   host: process.env.REDIS_HOST,
//   port: process.env.REDIS_PORT,
//   password: process.env.REDIS_PASSWORD,
// });
// const redisClient = require("redis").createClient();
// const redis = redisClient(6379, "localhost")

// const redisCon = redisClient(6379, "localhost");

const Redis = require("ioredis");
let client = new Redis(process.env.UPSTASH_REDIS_REST_URL);

// const { Redis } = require("@upstash/redis/with-fetch");
// // const redis = Redis.fromEnv()
// const redis = new Redis({
//   url: process.env.UPSTASH_REDIS_REST_URL,
//   token: process.env.UPSTASH_REDIS_REST_TOKEN,
// });

// const redisCon = require("redis");

// var redis = redisCon.createClient ({
//   url : 'gusc1-splendid-asp-30175.upstash.io',
//   port : '30175',
//   password: '2c2a82779ea24c3090a03685324955f9',
//   tls: {}
// });

// redis.on("error", function(err) {
//   throw err;
// });

//get Redis Cache
function get(redis_key) {
  return new Promise(async (resolve) => {
    client.get(redis_key, (err, reply) => {
      if (err) {
        console.log("Redis Conn Error", err);
      } else {
        console.log("Success Redis Get", redis_key);
        const isJson = Utils.isJsonString(reply);
        if (isJson) {
   
          resolve({ reply: JSON.parse(reply) });
        } else {
      
          resolve({ reply });
        }
       
    
      }
    });
  });
}

function set(redis_key, redis_value) {
  return new Promise(async (resolve) => {
    client.set(
      redis_key,
      typeof redis_value === "object"
        ? JSON.stringify(redis_value)
        : redis_value,
      (err, reply) => {
        if (err) {
          console.log("Redis Conn Error", err);
        } else {
          console.log("Success Redis Set", redis_key);
          resolve({ reply });
        }
      }
    );
  });
}

module.exports = {
  get,
  set,
};
