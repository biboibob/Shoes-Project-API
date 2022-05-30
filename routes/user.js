var bcrypt = require("bcryptjs");
var saltRounds = bcrypt.genSaltSync(10);

var express = require("express");
const router = express.Router();
const sequelize = require("sequelize");
const Validator = require("fastest-validator");
const jwt = require("jsonwebtoken");

router.use(express.json());

const { user } = require("../models");

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
      next()
    });
  }
}

router.post("/", async (req, res, next) => {
  const schema = {
    id: "number|optional",
    username: "string",
    password: "string|optional",
    email: "string",
    role: "string",
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  } else {
    const userAdd = await user.create(req.body);
    res.json({
      status: 200,
      content: "Success Adding New",
      data: userAdd,
    });
  }
});

/* GET users listing. */
router.get("/", authenticateToken, async (req, res, next) => {
  const data = await user.findAll();
  res.json({
    status: 200,
    content: "Fetching All Users",
    data: data,
  });
});


router.patch("/editUser", async (req, res, next) => {
  let specificUser = user.findByPk(session.userid);

  // const schema = {
  //   username: "string|optional",
  //   email: "string|optional",
  //   role: "string|optional",
  // };

  // const validate = v.validate(req.body, schema);

  // if (validate.length) {
  //   return res.status(400).json(validate);
  // } else {

  //   res.json({
  //     status: 200,
  //     content: "Success Adding New",
  //     data: specificUser,
  //   });
  // }
});

module.exports = router;
