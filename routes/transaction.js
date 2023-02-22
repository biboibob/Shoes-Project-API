var express = require("express");
const router = express.Router();
const Validator = require("fastest-validator");
const { Op } = require("sequelize");

// MiddleWare
const auth = require("../middleware/Auth");

//Models
const {
  transaction_detail,
  transaction_progress,
  transaction,
} = require("../models");

router.use(express.json());

const v = new Validator();

router.post("/", auth, async (req, res, next) => {
  const schema = {
    status: "string",
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
    const { status } = req.body;
    const transactionList = await transaction.findAll({
      // include: [
      //   {
      //     model: transaction_detail,
      //     as: "transaction_detail_parent",
      //   },
      //   {
      //     model: transaction_progress,
      //     as: "transaction_progress_parent",
      //   },
      // ],
      // where: {
      //   [Op.and]: [
      //     { id: req.userInfo.id },
      //     {
      //       status,
      //     },
      //   ],
      // },
    });

    res.json({
      status: 200,
      content: "Fetching Transaction List",
      data: {
        status: true,
        transactionList,
      },
    });
  }
});

module.exports = router;
