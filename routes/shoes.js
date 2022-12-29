var bcrypt = require("bcryptjs");
var saltRounds = bcrypt.genSaltSync(10);

var express = require("express");
const router = express.Router();
const { Sequelize, Op } = require("sequelize");
const Validator = require("fastest-validator");
const jwt = require("jsonwebtoken");

router.use(express.json());

const { shoes, stock } = require("../models");

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

/* GET Shoes listing. */
router.get("/HomeInitiate", authenticateToken, async (req, res, next) => {
  // const newRelease = await shoes.findAll({
  //   limit: 5,
  //   order: [["release_date", "DESC"]],
  // });

  // const popular = await shoes.findAll({
  //   attributes: ["name", "price", "release_date", "description"],
  //   include: {
  //     model: stock,
  //     attributes: ["stock_number", "color", "size", "sold"],
  //     order: [["sold", "DESC"]],
  //   },
  //   // limit: 5
  // });

  // const featured = await stock.findOne({
  //   attributes: [
  //     "id_shoes",
  //     [sequelize.fn("max", sequelize.col("sold")), "mostSold"],
  //   ],
  //   include: {
  //     model: shoes,
  //     where: {
  //       id_shoes: sequelize.col('stock.id_shoes')
  //     }
  //   },

  //   // where: {
  //   //   '$shoes.id_shoes$': '1'
  //   // },
  // });

  const feature = await stock.findOne({
    attributes: [
      [Sequelize.fn("max", Sequelize.col("stock.sold")), "mostSold"],
      "id_shoes",
    ],
    include: {
      model: shoes,
      as: "shoes",
    },
    where: {
      "$shoes.id_shoes$": { [Op.eq]: Sequelize.col("stock.id_shoes") },
    },
  });

  res.json({
    status: 200,
    content: "Fetching All Users",
    data: {
      feature,
      // popular,
      // newRelease
    },
  });
});

module.exports = router;
