var bcrypt = require("bcryptjs");
var saltRounds = bcrypt.genSaltSync(10);

/* import library */
var express = require("express");
const router = express.Router();
const { Sequelize, Op } = require("sequelize");
const Validator = require("fastest-validator");
const jwt = require("jsonwebtoken");

router.use(express.json());

// MiddleWare
const auth = require("../middleware/Auth");

/* Import Model */
const { shoes, stock, product, category, image } = require("../models");

const v = new Validator();

/* GET Home Initiate */
router.get("/HomeInitiate", auth, async (req, res, next) => {
  const newRelease = await product.findAll({
    include: [
      {
        model: shoes,
        as: "shoes",
        include: [
          {
            model: image,
            as: "image",
          },
        ],
      },
      {
        model: category,
        as: "category",
      },
    ],
    limit: 10,
    order: [[shoes, "release_date", "DESC"]],
    // group: ["shoes.name"],
  });

  const popular = await product.findAll({
    include: [
      {
        model: shoes,
        as: "shoes",
        include: [
          {
            model: stock,
            as: "stock",
          },
          {
            model: image,
            as: "image",
          },
        ],
      },
      {
        model: category,
        as: "category",
      },
    ],
    limit: 10,
    order: [[shoes, stock, "sold", "DESC"]],
    group: ["id_shoes"],
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
        include: [
          {
            model: image,
            as: "image",
            where: {
              type: {
                [Op.ne]: "display",
              } 
            }
          },
        ],
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
