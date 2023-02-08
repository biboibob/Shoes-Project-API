var bcrypt = require("bcryptjs");
var saltRounds = bcrypt.genSaltSync(10);

/* import library */
var express = require("express");
const router = express.Router();
const { Sequelize, Op } = require("sequelize");
const Validator = require("fastest-validator");
const jwt = require("jsonwebtoken");
const axios = require("axios");

router.use(express.json());

/* Import Models */
const { shoes, stock, sales, category, product } = require("../models");

const v = new Validator();

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).send("No Token Send!");
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userInfo) => {
      if (err) return res.status(403).send("Your Token No Longer Valid");
      req.userInfo = userInfo;
      next();
    });
  }
}

/* GET Offer List  */
router.get("/getShippingOption", authenticateToken, async (req, res, next) => {
  //   const getOfferList = await sales.findAll();

  //   const colorOpt = await stock.findAll({
  //     attributes: ["color"],
  //     group: ["color"],
  //   });

  //   const sizeOpt = await stock.findAll({
  //     attributes: ["size"],
  //     group: ["size"],
  //   });

  const result = await axios({
    url: "https://api.rajaongkir.com/starter/province",
    method: "get",
    headers: { key: "8553a67dd663ed2f55f84f74318760fa" },
  }).then((res) => {
    return res;
  });

  console.log(result.data.rajaongkir);

  res.json({
    status: 200,
    content: "Fetching All Users",
    data: {
      status: true,
      test: "test",
      //   test2: result
    },
  });
});

module.exports = router;
