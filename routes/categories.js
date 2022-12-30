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
const { shoes, stock, sales, category } = require("../models");

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
  "/CategoriesInitiate",
  authenticateToken,
  async (req, res, next) => {
    //   const newRelease = await shoes.findAll({
    //     limit: 5,
    //     order: [["release_date", "DESC"]],
    //   });

    const schema = {
      gender: "array|optional",
      minPrice: "number|optional",
      maxPrice: "number|optional",
      size: "number|optional",
      color: "string|optional",
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
      const getShoesList = await shoes.findAll({
        include: [
          {
            model: category,
            as: "category",
          },
          {
            model: sales,
            as: "sales",
          },
        ],
      });

      res.json({
        status: 200,
        content: "Fetch Success",
        data: {
          status: true,
          data: getShoesList,
        },
      });
    }
  }
);

/* GET Offer List  */
router.get("/GetOfferList", authenticateToken, async (req, res, next) => {
  const getOfferList = await sales.findAll();

  res.json({
    status: 200,
    content: "Fetching All Users",
    data: {
      status: true,
      getOfferList,
    },
  });
});

module.exports = router;
