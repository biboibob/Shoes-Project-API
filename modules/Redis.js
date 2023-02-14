
//Disable this to make vercel respect environtment variable declared
// require("dotenv").config();
//End

const Utils = require("../utils/index");

const Redis = require("ioredis");
let client = new Redis(process.env.UPSTASH_REDIS_REST_URL);

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
