const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
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


  module.exports = authenticateToken;