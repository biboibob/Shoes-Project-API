// const { createClient } = require("redis");
// let redisClient = createClient({
//   host: "localhost",
//   port: 6379,
//   legacyMode: true,
// });

const redisClient = require("redis").createClient;
// const RedisCon = redisClient(6379, "localhost")

// const redisCon = redisClient(6379, "localhost");

//get Redis Cache
function get(redis_key) {
  return new Promise(async (resolve) => {
    redisClient().get(redis_key, (err, reply) => {
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
    redisClient().set(redis_key, redis_value, (err, reply) => {
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
