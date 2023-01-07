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
const { shoes, stock, product, category } = require("../models");

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
  const newRelease = await product.findAll({
    include: [
      {
        model: shoes,
        as: "shoes",
      },
      {
        model: category,
        as: "category",
      },
    ],
    limit: 10,
    order: [[shoes, "release_date", "DESC"]],
  });

  const popular = await product.findAll({
    include: [
      {
        model: shoes,
        as: "shoes",
        include: {
          model: stock,
          as: "stock",
        },
      },
      {
        model: category,
        as: "category",
      },
    ],
    limit: 10,
    group: ["id_shoes"],
    order: [[shoes, stock, "sold", "DESC"]],
  });

  const detailShoes = await stock.findOne({
    attributes: ["id_shoes", "sold"],
    include: [
      {
        model: shoes,
        as: "shoes",
        where: {
          id_shoes: { [Op.eq]: Sequelize.col("stock.id_shoes") },
        },
      },
    ],
    order: [["sold", "DESC"]],
  });

  const sizeOpt = await stock.findAll({
    attributes: ["size"],
    group: ["size"],
    where: {
      id_shoes: detailShoes.dataValues.id_shoes,
    },
  });

  const colorOpt = await stock.findAll({
    attributes: ["color"],
    group: ["color"],
    where: {
      id_shoes: detailShoes.dataValues.id_shoes,
    },
  });

  const categoryShoes = await product.findOne({
    include: {
      model: category,
      as: "category",
    },
    where: {
      id_shoes: detailShoes.dataValues.id_shoes,
    },
  });

  res.json({
    status: 200,
    content: "Fetching All Users",
    data: {
      status: true,
      featured: {
        detailShoes,
        colorOpt,
        sizeOpt,
        categoryShoes,
      },
      popular,
      newRelease,
    },
  });
});

module.exports = router;
