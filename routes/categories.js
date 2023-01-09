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

/* POST Home Initiate - (Required to get shoes data) */
router.post(
  "/GetShoesListCategory",
  authenticateToken,
  async (req, res, next) => {
    //   const newRelease = await shoes.findAll({
    //     limit: 5,
    //     order: [["release_date", "DESC"]],
    //   });

    const {
      size = [],
      color = [],
      minPrice = 0,
      maxPrice = 0,
      gender = [],
      offer = [],
    } = req.body;

    const schema = {
      gender: "array|optional",
      minPrice: "number|optional",
      maxPrice: "number|optional",
      size: "array|optional",
      color: "array|optional",
      offer: "array|optional",
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
      /* Object Option to Define Where should use or not*/
      const option = [];

      /* Payload Condition */
      if (size.length > 0) {
        option.push({
          "$shoes.stock.size$": {
            [Op.and]: [
              {
                [Op.gte]: Math.min(...size),
                
              },{
                [Op.lte]: Math.max(...size),
              }
            ],
          },
        });
      }
      if (color.length > 0) {
        option.push({
          "$shoes.stock.color$": {
            [Op.in]: color,
          },
        });
      }
      if (gender.length > 0) {
        option.push({
          "$category.category_name$": {
            [Op.in]: gender,
          },
        });
      }
      if (minPrice > 0) {
        option.push({
          "$shoes.price$": {
            [Op.gte]: minPrice,
          },
        });
      }

      if (maxPrice > 0) {
        option.push({
          "$shoes.price$": {
            [Op.lte]: maxPrice,
          },
        });
      }

      if (offer.length > 0) {
        option.push({
          "$sales.id_sale$": {
            [Op.in]: offer,
          },
        });
      }

      /* End Payload Condition */

      const getShoesList = await product.findAll({
        include: [
          {
            model: category,
            as: "category",
          },
          {
            model: sales,
            as: "sales",
          },
          {
            model: shoes,
            as: "shoes",
            include: [
              {
                model: stock,
                as: "stock",
              },
            ],
          },
        ],
        group: ["id_shoes"],
        where: {
          [Op.and]: option,
        },
      });

      res.json({
        status: 200,
        content: "Fetch Success",
        data: {
          status: true,
          getShoesList,
        },
      });
    }
  }
);

/* GET Offer List  */
router.get("/GetInitiateFilter", authenticateToken, async (req, res, next) => {
  const getOfferList = await sales.findAll();

  const colorOpt = await stock.findAll({
    attributes: ["color"],
    group: ["color"],
  });

  const sizeOpt = await stock.findAll({
    attributes: ["size"],
    group: ["size"],
  });

  res.json({
    status: 200,
    content: "Fetching All Users",
    data: {
      status: true,
      getOfferList,
      colorOpt,
      sizeOpt,
    },
  });
});

module.exports = router;
