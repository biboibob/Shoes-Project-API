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
const {
  shoes,
  stock,
  sales,
  category,
  product,
  user,
  transaction,
  transaction_detail,
  transaction_progress,
} = require("../models");

const v = new Validator();

/* GET Offer List  */
router.post("/getShippingOption", auth, async (req, res, next) => {
  const redisShippingOption = await Redis.get("shippingOption");
  const redisWeight = await Redis.get("lastTotalWeight");

  const { totalWeight } = req.body;

  const data = await user.findOne({
    attributes: { exclude: ["password"] },
    where: {
      id: req.userInfo.id,
    },
  });

  const { city } = data.dataValues;

  // Cache Hit
  if (
    redisShippingOption &&
    city === redisShippingOption?.reply?.city &&
    redisWeight.reply === totalWeight
  ) {
    res.json({
      status: 200,
      content: "Fetching All Users",
      data: {
        status: true,
        data: redisShippingOption?.reply?.data,
      },
    });
  } else {
    // Cache Miss
    const resultJNE = await axios({
      url: "https://api.rajaongkir.com/starter/cost",
      method: "post",
      data: {
        origin: "154",
        destination: city,
        weight: totalWeight,
        courier: "jne",
      },
      headers: { key: process.env.RAJA_ONGKIR_API_KEY },
    }).then((res) => {
      return res;
    });

    const resultTIKI = await axios({
      url: "https://api.rajaongkir.com/starter/cost",
      method: "post",
      data: {
        origin: "154",
        destination: city,
        weight: totalWeight,
        courier: "tiki",
      },
      headers: { key: process.env.RAJA_ONGKIR_API_KEY },
    }).then((res) => {
      return res;
    });

    const resultPOS = await axios({
      url: "https://api.rajaongkir.com/starter/cost",
      method: "post",
      data: {
        origin: "154",
        destination: city,
        weight: totalWeight,
        courier: "pos",
      },
      headers: { key: process.env.RAJA_ONGKIR_API_KEY },
    }).then((res) => {
      return res;
    });

    Redis.set("lastTotalWeight", totalWeight);

    Redis.set("shippingOption", {
      city: resultJNE.data.rajaongkir.destination_details.city_id,
      province: resultJNE.data.rajaongkir.destination_details.province_id,
      postal_code: resultJNE.data.rajaongkir.destination_details.postal_code,
      data: [
        resultJNE.data.rajaongkir.results[0],
        resultTIKI.data.rajaongkir.results[0],
        resultPOS.data.rajaongkir.results[0],
      ],
    });

    res.json({
      status: 200,
      content: "Fetching All Users",
      data: {
        status: true,
        data: [
          resultJNE.data.rajaongkir.results[0],
          resultTIKI.data.rajaongkir.results[0],
          resultPOS.data.rajaongkir.results[0],
        ],
      },
    });
  }
});

/* GET Province List  */
router.get("/getProvince", auth, async (req, res, next) => {
  const redisProvinceOption = await Redis.get("provinceOption");
  const redisLogin = await Redis.get("loginData");

  // Cache Hit
  if (redisProvinceOption.reply !== null) {
    res.json({
      status: 200,
      content: "Fetching All Users",
      data: {
        status: true,
        province: redisProvinceOption?.reply?.data,
      },
    });
  } else {
    //cache Miss
    const provinceRajaOngkir = await axios({
      url: "https://api.rajaongkir.com/starter/province",
      method: "get",
      headers: { key: process.env.RAJA_ONGKIR_API_KEY },
    }).then((res) => {
      return res;
    });

    Redis.set("provinceOption", {
      province: redisLogin.reply?.province,
      data: provinceRajaOngkir.data.rajaongkir,
    });

    res.json({
      status: 200,
      content: "Fetching All Users",
      data: {
        status: true,
        province: provinceRajaOngkir.data.rajaongkir,
      },
    });
  }
});

/* GET City List  */
router.post("/getCity", auth, async (req, res, next) => {
  const redisCityOption = await Redis.get("cityOption");
  const redisProvinceOption = await Redis.get("provinceOption");

  const { province } = req.body;

  // Cache Hit
  if (
    redisCityOption.reply !== null &&
    redisProvinceOption.reply.province === province
  ) {
    res.json({
      status: 200,
      content: "Fetching All Users",
      data: {
        status: true,
        city: redisCityOption?.reply?.data,
      },
    });
  } else {
    // Cache Miss
    const cityRajaOngkir = await axios({
      url: "https://api.rajaongkir.com/starter/city",
      method: "GET",
      params: { province: province },
      headers: { key: process.env.RAJA_ONGKIR_API_KEY },
    }).then((res) => {
      return res;
    });

    // Handle Stale Data From Cache API
    Redis.set("provinceOption", {
      ...redisProvinceOption.reply,
      province: province,
    });
    //End Handle Stale

    Redis.set("cityOption", {
      data: cityRajaOngkir.data.rajaongkir,
    });

    res.json({
      status: 200,
      content: "Fetching All Users",
      data: {
        status: true,
        city: cityRajaOngkir.data.rajaongkir,
      },
    });
  }
});

router.post("/proceedTransaction", auth, async (req, res, next) => {
  const schema = {
    payment_method: "string",
    courier: "string",
    purchased_date: "string",
    receipt_number: "number|optional",
    total_price: "number",
    shoes: {
      type: "array",
      items: {
        type: "object",
        props: {
          id_product: "number",
          name: "string",
          category: "string",
          image: "string",
          price: "number",
          quantity: "number",
          color: "string",
          size: "string",
        },
      },
    },
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.json({
      status: 200,
      content: "Format Invalid",
      data: {
        status: false,
        message: validate[0].message,
      },
    });
  } else {
    const progressState = [
      {
        name: "Purchase Confirmed",
        description:
          "Your order has been confirmed by us, and we will prepare to pack your order.",
      },
      {
        name: "Packed Your Order",
        description:
          "Currently We Pack Your Order, and will be picked up by our courier agent soon.",
      },
    ];
    // const { username, email, role, ...addressData } = req.body;

    const { courier, payment_method, total_price, purchased_date, shoes } =
      req.body;

    const transactionData = await transaction.create({
      id: req.userInfo.id,
      courier,
      payment_method,
      total_price,
      purchased_date,
      status: "On-Progress",
    });

    progressState.map(async (val) => {
      await transaction_progress.create({
        id_transaction: transactionData.dataValues.id_transaction,
        progress_name: val.name,
        progress_description: val.description,
        date: purchased_date,
      });
    });

    shoes?.map(async (val) => {
      await transaction_detail.create({
        id_transaction: transactionData.dataValues.id_transaction,
        id_product: val.id_product,
        name: val.name,
        category: val.category,
        image: val.image,
        price: val.price,
        color: val.color,
        quantity: val.quantity,
        size: val.size,
      });
    });

    res.json({
      status: 200,
      content: "Your purchase has been succeed",
      data: {},
    });
  }
});

module.exports = router;
