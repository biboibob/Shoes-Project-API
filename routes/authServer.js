var bcrypt = require("bcryptjs");
var saltRounds = bcrypt.genSaltSync(10);

var express = require("express");
const router = express.Router();
const sequelize = require("sequelize");
const Validator = require("fastest-validator");
const jwt = require("jsonwebtoken");
const Redis = require("../modules/Redis");

const { user } = require("../models");

//validator input
const v = new Validator();

router.use(express.json());

router.post("/refreshToken", async (req, res) => {
  const refreshToken = req.body.token;
  const redisRefreshToken = await Redis.get("RedisRefToken");

  if (refreshToken == null) return res.sendStatus(401);
  if (redisRefreshToken.reply !== refreshToken) return res.sendStatus(403);
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, userInfo) => {
      if (err) return res.sendStatus(403);

      const { id, username, email, role } = userInfo;

      const accessToken = generateAccessToken({ id, username, email, role });
      const newRefreshToken = generateRefreshToken({
        id,
        username,
        email,
        role,
      });
      Redis.set("RedisRefToken", newRefreshToken);
      res.json({ accessToken: accessToken, refreshToken: newRefreshToken });
    }
  );
});

router.post("/login", async (req, res, next) => { 
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
        message: "Please Check Your Username or Password",
      });
    } else {
      const compareHash = bcrypt.compareSync(password, data.password);
      if (!compareHash) {
        res.json({
          status: 400,
          message: "Please Check Your Username or Password",
        });
      } else {
        //set JWT Token for client
        const { id, username, email, role } = data.dataValues;
        const userInfo = { id, username, email, role };

        const accessToken = generateAccessToken(userInfo);
        const refreshToken = jwt.sign(
          userInfo,
          process.env.REFRESH_TOKEN_SECRET
        );
        Redis.set("RedisRefToken", refreshToken);
        Redis.set("loginData", userInfo);
        res.json({
          status: 200,
          content: "Welcome",
          data: {
            accessToken: accessToken,
            refreshToken: refreshToken,
            userInfo: userInfo,
          },
        });
      }
    }
  }
});

router.delete("/logout", async (req, res) => {
  Redis.del("loginData");
  Redis.del("RedisRefToken");
  res.sendStatus(204);
});

function generateAccessToken(userInfo) {
  return jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "12h",
  });
}

function generateRefreshToken(userInfo) {
  return jwt.sign(userInfo, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "24h",
  });
}

module.exports = router;
