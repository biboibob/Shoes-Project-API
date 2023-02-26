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
  stock,
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


router.post("/proceedTransaction", auth, async (req, res, next) => {
  const schema = {
    payment_method: "string",
    courier: "string",
    purchased_date: "string",
    receipt_number: "number|optional",
    total_price: "number",
    total_discount: "number",
    shipping_cost: "number",
    shoes: {
      type: "array",
      items: {
        type: "object",
        props: {
          id_product: "number",
          id_shoes: "number",
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
        name: "Packed Your Order",
        description:
          "Currently we're packing your order, our courier will be assigned to pick up the package.",
      },
      {
        name: "Purchase Confirmed",
        description:
          "Your order has been confirmed, and we will send it to warehouse station.",
      },
    ];

    const {
      courier,
      payment_method,
      total_price,
      total_discount,
      shipping_cost,
      purchased_date,
      shoes,
    } = req.body;

    const transactionData = await transaction.create({
      id: req.userInfo.id,
      courier,
      payment_method,
      total_price,
      purchased_date,
      shipping_cost,
      total_discount,
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
      await stock.decrement("stock_number", {
        by: val.quantity,
        where: { id_shoes: val.id_shoes, color: val.color, size: val.size },
      });

      await stock.increment("sold", {
        by: val.quantity,
        where: { id_shoes: val.id_shoes, color: val.color, size: val.size },
      });

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
