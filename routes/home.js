var bcrypt = require("bcryptjs");
var saltRounds = bcrypt.genSaltSync(10);

/* import library */
var express = require("express");
const router = express.Router();
const { Sequelize, Op } = require("sequelize");
const Validator = require("fastest-validator");
const jwt = require("jsonwebtoken");

router.use(express.json());

/* Import Model */
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

/* GET Home Initiate */
router.get("/HomeInitiate", authenticateToken, async (req, res, next) => {
  const newRelease = await shoes.findAll({
    limit: 5,
    order: [["release_date", "DESC"]],
  });

  const popular = await shoes.findAll({
    attributes: ["name", "price", "release_date", "description"],
    include: {
      model: stock,
      as: 'stock',
      attributes: ["stock_number", "color", "size", "sold"],
      order: [["sold", "DESC"]],
    },
    // limit: 5
  });

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
      status: true,
      feature,
      popular,
      newRelease
    },
  });
});

module.exports = router;
