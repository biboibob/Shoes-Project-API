var bcrypt = require("bcryptjs");
var saltRounds = bcrypt.genSaltSync(10);

/* import library */
var express = require("express");
const router = express.Router();
const { Sequelize, Op } = require("sequelize");
const Validator = require("fastest-validator");
const axios = require("axios");

// MiddleWare
const auth = require("../middleware/Auth");

router.use(express.json());

/* Import Models */
const { shoes, stock, sales, category, product, user } = require("../models");

const v = new Validator();

/* GET Offer List  */
router.post("/getShippingOption", auth, async (req, res, next) => {
  const { totalWeight } = req.body;
  //   const getOfferList = await sales.findAll();

  //   const colorOpt = await stock.findAll({
  //     attributes: ["color"],
  //     group: ["color"],
  //   });

  //   const sizeOpt = await stock.findAll({
  //     attributes: ["size"],
  //     group: ["size"],
  //   });

  const data = await user.findOne({
    attributes: { exclude: ["password"] },
    where: {
      id: req.userInfo.id,
    },
  });

  const { city } = data.dataValues;

  const resultJNE = await axios({
    url: "https://api.rajaongkir.com/starter/cost",
    method: "post",
    data: {
      origin: "154",
      destination: city,
      weight: totalWeight,
      courier: "jne",
    },
    headers: { key: process.env.RAJA_ONGKIR_API_KEY },
  }).then((res) => {
    return res;
  });

  const resultTIKI = await axios({
    url: "https://api.rajaongkir.com/starter/cost",
    method: "post",
    data: {
      origin: "154",
      destination: city,
      weight: totalWeight,
      courier: "tiki",
    },
    headers: { key: process.env.RAJA_ONGKIR_API_KEY },
  }).then((res) => {
    return res;
  });

  const resultPOS = await axios({
    url: "https://api.rajaongkir.com/starter/cost",
    method: "post",
    data: {
      origin: "154",
      destination: city,
      weight: totalWeight,
      courier: "pos",
    },
    headers: { key: process.env.RAJA_ONGKIR_API_KEY },
  }).then((res) => {
    return res;
  });

  res.json({
    status: 200,
    content: "Fetching All Users",
    data: {
      status: true,
      data: [
        resultJNE.data.rajaongkir.results[0],
        resultTIKI.data.rajaongkir.results[0],
        resultPOS.data.rajaongkir.results[0],
      ],
      //   test2: result
    },
  });
});

/* GET Province List  */
router.get("/getProvince", auth, async (req, res, next) => {
  const province = await axios({
    url: "https://api.rajaongkir.com/starter/province",
    method: "get",
    headers: { key: process.env.RAJA_ONGKIR_API_KEY },
  }).then((res) => {
    return res;
  });

  res.json({
    status: 200,
    content: "Fetching All Users",
    data: {
      status: true,
      province: province.data.rajaongkir,
    },
  });
});

/* GET City List  */
router.post("/getCity", auth, async (req, res, next) => {
  const { province } = req.body;

  const city = await axios({
    url: "https://api.rajaongkir.com/starter/city",
    method: "GET",
    params: { province: province },
    headers: { key: process.env.RAJA_ONGKIR_API_KEY },
  }).then((res) => {
    return res;
  });

  res.json({
    status: 200,
    content: "Fetching All Users",
    data: {
      status: true,
      city: city.data.rajaongkir,
    },
  });
});

module.exports = router;
