var bcrypt = require("bcryptjs");
var saltRounds = bcrypt.genSaltSync(10);

var express = require("express");
const router = express.Router();
const sequelize = require("sequelize");
const Validator = require("fastest-validator");
const axios = require("axios");
const Redis = require("../modules/Redis");

// MiddleWare
const auth = require("../middleware/Auth");

//Models
const { user } = require("../models");

router.use(express.json());

const v = new Validator();

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
    const { username } = req.body;
    const findUser = await user.findOne({
      where: {
        username: username,
      },
    });

    if (findUser === null) {
      const userAdd = await user.create(req.body);
      res.json({
        status: 200,
        content: "Success Adding New",
        data: userAdd,
      });
    } else {
      res.status(406).send({ error: 'Username already used!' })
    }
  }
});

/* GET users listing. */
router.get("/", auth, async (req, res, next) => {
  const data = await user.findAll();
  res.json({
    status: 200,
    content: "Fetching All Users",
    data: data,
  });
});

/* GET users listing. */
router.get("/detailUser", auth, async (req, res, next) => {
  const data = await user.findOne({
    attributes: { exclude: ["password"] },
    where: {
      id: req.userInfo.id,
    },
  });

  // const dataProvinceAndCity = await axios({
  //   url: "https://api.rajaongkir.com/starter/city",
  //   method: "GET",
  //   params: { province: data.province, id: data.city },
  //   headers: { key: process.env.RAJA_ONGKIR_API_KEY },
  // }).then((res) => {
  //   return res;
  // });

  // const { city_name, province } = dataProvinceAndCity.data.rajaongkir.results;

  res.json({
    status: 200,
    content: "Fetching Specific User",
    data: {
      ...data,
      dataValues: {
        ...data.dataValues,
        // city_name: city_name,
        // province_name: province,
      },
    },
  });
});

router.patch("/editUser", auth, async (req, res, next) => {
  const schema = {
    username: "string|optional",
    email: "string|optional",
    role: "string|optional",
    receiver: "string|optional",
    phone: "string|optional",
    detail_address: "string|optional",
    address_note: "string|optional",
    city: "string|optional",
    cit_name: "string|optional",
    province: "string|optional",
    province_name: "string|optional",
    postal_code: "string|optional",
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  } else {
    const redisLogin = await Redis.get("loginData");

    const { username, email, role, ...addressData } = req.body;

    //Update Redis Cache
    Redis.set("loginData", {
      ...redisLogin.reply,
      ...addressData,
    });

    await user.update(addressData, {
      where: { id: req.userInfo.id },
    });

    res.json({
      status: 200,
      content: "Success Update New Value",
    });
  }
});

module.exports = router;
