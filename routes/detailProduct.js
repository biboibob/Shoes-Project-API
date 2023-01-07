var bcrypt = require("bcryptjs");
var saltRounds = bcrypt.genSaltSync(10);

/* import library */
var express = require("express");
const router = express.Router();
const { Sequelize, Op } = require("sequelize");
const Validator = require("fastest-validator");
const jwt = require("jsonwebtoken");

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

/* POST get dataShoes */
router.post("/", authenticateToken, async (req, res, next) => {
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
      },
    });
    const shoesDetail = await shoes.findAll({
      attributes: ["name", "price", "release_date", "description"],
      include: [
        {
          model: stock,
          as: "stock",
          attributes: ["stock_number", "size", "sold"],
        },
      ],
      where: {
        id_shoes: id_shoes,
      },
    });

    res.json({
      status: 200,
      content: "Fetch Success",
      data: {
        status: true,
        colorOpt,
        shoesDetail,
      },
    });
  }
});

module.exports = router;
