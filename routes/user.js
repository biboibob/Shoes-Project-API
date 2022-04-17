var bcrypt = require("bcryptjs");
var saltRounds = bcrypt.genSaltSync(10);

const sequelize = require("sequelize");
var express = require("express");
var router = express.Router();
const Validator = require("fastest-validator");

const { user } = require("../models");

const v = new Validator();

router.post("/", async (req, res, next) => {
  const schema = {
    id: "number|optional",
    username: "string",
    password: "string",
    email: "string",
    role: "string",
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  } else {
    const userAdd = await user.create(req.body);
    res.json(userAdd);
  }
});

/* GET users listing. */
router.get("/", async (req, res, next) => {
  const data = await user.findAll();
  res.json(data);
  // res.json({ message: "hi im in!"});
});

router.post("/auth", async (req, res, next) => {
  const schema = {
    id: "number|optional",
    username: "string",
    password: "string",
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  } else {
    const { username, password } = req.body;
    const data = await user.findOne({
      where: sequelize.where(
        sequelize.fn("BINARY", sequelize.col("username")),
        username
      ),
    });

    if (data === null) {
      res.json({
        status: 400,
        content: "Your Username Doesn't Exist",
        data: [],
      });
    } else {
      const compareHash = bcrypt.compareSync(password, data.password);
      if (!compareHash) {
        res.json({
          status: 400,
          content: "Your Password Wrong",
          data: [],
        });
      } else {
        res.json({
          status: 200,
          content: "Welcome",
          data: data,
        });
      }
    }
  }
});

module.exports = router;
