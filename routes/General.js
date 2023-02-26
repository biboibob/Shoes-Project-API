/* import library */
var express = require("express");
const router = express.Router();
const Validator = require("fastest-validator");
const axios = require("axios");
const Redis = require("../modules/Redis");

// MiddleWare
const auth = require("../middleware/Auth");

router.use(express.json());

const v = new Validator();

/* GET Province List  */
router.get("/getProvince", auth, async (req, res, next) => {
    const redisProvinceOption = await Redis.get("provinceOption");
    const redisLogin = await Redis.get("loginData");
  
    // Cache Hit
    if (redisProvinceOption.reply !== null) {
      res.json({
        status: 200,
        content: "Fetching All Users",
        data: {
          status: true,
          province: redisProvinceOption?.reply?.data,
        },
      });
    } else {
      //cache Miss
      const provinceRajaOngkir = await axios({
        url: "https://api.rajaongkir.com/starter/province",
        method: "get",
        headers: { key: process.env.RAJA_ONGKIR_API_KEY },
      }).then((res) => {
        return res;
      });
  
      Redis.set("provinceOption", {
        province: redisLogin.reply?.province,
        data: provinceRajaOngkir.data.rajaongkir,
      });
  
      res.json({
        status: 200,
        content: "Fetching All Users",
        data: {
          status: true,
          province: provinceRajaOngkir.data.rajaongkir,
        },
      });
    }
  });
  
  /* GET City List  */
  router.post("/getCity", auth, async (req, res, next) => {
    const redisCityOption = await Redis.get("cityOption");
    const redisProvinceOption = await Redis.get("provinceOption");
  
    const { province } = req.body;
  
    // Cache Hit
    if (
      redisCityOption.reply !== null &&
      redisProvinceOption.reply.province === province
    ) {
      res.json({
        status: 200,
        content: "Fetching All Users",
        data: {
          status: true,
          city: redisCityOption?.reply?.data,
        },
      });
    } else {
      // Cache Miss
      const cityRajaOngkir = await axios({
        url: "https://api.rajaongkir.com/starter/city",
        method: "GET",
        params: { province: province },
        headers: { key: process.env.RAJA_ONGKIR_API_KEY },
      }).then((res) => {
        return res;
      });
  
      // Handle Stale Data From Cache API
      Redis.set("provinceOption", {
        ...redisProvinceOption.reply,
        province: province,
      });
      //End Handle Stale
  
      Redis.set("cityOption", {
        data: cityRajaOngkir.data.rajaongkir,
      });
  
      res.json({
        status: 200,
        content: "Fetching All Users",
        data: {
          status: true,
          city: cityRajaOngkir.data.rajaongkir,
        },
      });
    }
  });

  module.exports = router;