var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({
    status: 200,
    content: "Fetch data successfull",
    data: [
      {
        "test": 123
      }
    ]
  });
});

module.exports = router;
