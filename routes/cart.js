/* import library */
var bcrypt = require("bcryptjs");
var saltRounds = bcrypt.genSaltSync(10);
var express = require("express");
const router = express.Router();
const { Sequelize, Op } = require("sequelize");
const Validator = require("fastest-validator");
const axios = require("axios");
const Redis = require("../modules/Redis");

// MiddleWare
const auth = require("../middleware/Auth");

router.use(express.json());

/* Import Models */
const { stock, shoes } = require("../models");

const v = new Validator();

router.post("/getStock", auth, async (req, res, next) => {
  const schema = {
    id_shoes: "array|optional",
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
    const { id_shoes } = req.body;

    const shoesCart = await shoes.findAll({
      include: {
        model: stock,
        as: "stock",
      },
      where: {
        id_shoes: id_shoes,
      },
    });

    res.json({
      status: 200,
      content: "Fetching Cart",
      data: {
        status: true,
        shoesCart,  
      },
    });
  }
});

module.exports = router;
