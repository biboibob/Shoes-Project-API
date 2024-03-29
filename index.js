//Disable this to make vercel respect environtment variable declared
// require("dotenv").config();
//End
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var session = require("express-session");
//var logger = require("morgan");
// const session = require("express-session")
// let RedisStore = require("connect-redis")(session)

var app = express();

//path API
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/user");
var homeRouter = require("./routes/home");
var authRouter = require("./routes/authServer");
var categoriesRouter = require("./routes/categories");
var detailProductRouter = require("./routes/detailProduct");
var summaryRouter = require("./routes/Summary");
var transactionRouter = require("./routes/transaction");
var cartRouter = require("./routes/cart");
var GeneralRouter = require("./routes/General");

// enable this if you run behind a proxy (e.g. nginx)
app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//Redis Config
// const { createClient } = require("redis")
// let redisClient = createClient({ legacyMode: true })

// app.use(
//   session({
//     store: new RedisStore({ client: redisClient }),
//     saveUninitialized: false,
//     secret: "keyboard cat",
//     resave: false,
//   })
// )

app.use(
  session({
    secret: "rootSession",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, sameSite: 'none', domain: ".google.com" },
  })
);

//session middleware
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  //Add Because Google has SameSite Strict as Defualt
  // res.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=None")

  // Request headers you wish to allow
  // res.setHeader(
  //   "Access-Control-Allow-Headers",
  //   "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  // );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,  Access-Control-Request-Method, Access-Control-Request-Headers, Content-Type, Authorization, X-CSRF-Token, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
  );

  //es.setHeader("Access-Control-Request-Headers", true);

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/authServer", authRouter);
app.use("/home", homeRouter);
app.use("/categories", categoriesRouter);
app.use("/detailProduct", detailProductRouter);
app.use("/summary", summaryRouter);
app.use("/transaction", transactionRouter);
app.use("/cart", cartRouter);
app.use("/general", GeneralRouter);

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => console.log(`This App is running on ${PORT} port`));

module.exports = app;
