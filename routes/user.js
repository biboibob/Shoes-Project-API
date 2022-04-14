var express = require("express");
var router = express.Router();

const Validator = require("fastest-validator");

const { user } = require("../models");

const v = new Validator();

// router.post("/", async (req, res, next) => {
//   const schema = {
//     id: "number|optional",
//     name: "string",
//     role: "string",
//   };

//   const validate = v.validate(req.body, schema);

//   if (validate.length) {
//     return res.status(400).json(validate);
//   } else {
//     const userAdd = await user.create(req.body);
//     res.json(userAdd);
//   }
// });

/* GET users listing. */
router.get("/", async (req, res, next) => {
//   const data = await user.findAll();
//   return res.json(data);
    res.json({ message: "hi im in!"});
});

module.exports = router;
