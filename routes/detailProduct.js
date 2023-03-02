var bcrypt = require("bcryptjs");
var saltRounds = bcrypt.genSaltSync(10);

/* import library */
var express = require("express");
const router = express.Router();
const { Sequelize, Op } = require("sequelize");
const Validator = require("fastest-validator");
const jwt = require("jsonwebtoken");
const Redis = require("../modules/Redis");

router.use(express.json());

// MiddleWare
const auth = require("../middleware/Auth")

/* Import Models */
const { shoes, stock, sales, category, product, image } = require("../models");

const v = new Validator();

/* POST get dataShoes */
router.post("/", auth, async (req, res, next) => {
  const { id_shoes } = req.body;

  const schema = {
    id_shoes: "number",
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.json({
      status: 200,
      content: "Format Invalid",
      data: {
        status: false,
      },
    });
  } else {
    const colorOpt = await stock.findAll({
      attributes: ["color"],
      group: ["color"],
      where: {
        id_shoes: id_shoes,
      }
    });

    const sizeOpt = await stock.findAll({
      attributes: ["size", "stock_number"],
      group: ["size"],
      where: {
        id_shoes: id_shoes,
      }
    });

    const shoesDetail = await shoes.findOne({
      include: [
        {
          model: stock,
          as: "stock",
          attributes: ["stock_number", "color", "size", "sold"],
        },
      ],
      where: {
        id_shoes: id_shoes,
      },
    });

    const shoesPreview = await image.findAll({
      where: {
        id_shoes: id_shoes,
      },
    });

    const categoryShoes = await product.findOne({
      include: {
        model: category,
        as: "category"
      },
      where: {
        id_shoes: id_shoes,
      },
    })

    res.json({
      status: 200,
      content: "Fetch Success",
      data: {
        status: true,
        colorOpt,
        sizeOpt,
        categoryShoes,
        shoesDetail,
        shoesPreview
      },
    });
  }
});

module.exports = router;
