var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");

let users = {};

// Validation rules.
// Validation Array
var loginValidate = [
  // Check Username
  check("username", "Username Must Be an Email Address")
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(),
  // Check Password
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password Must Be at Least 8 Characters")
    // .matches("[0-9]")
    // .withMessage("Password Must Contain a Number")
    // .matches("[A-Z]")
    // .withMessage("Password Must Contain an Uppercase Letter")
    .trim()
    .escape(),
];

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Sample App" });
});

router.get("/register", function (req, res, next) {
  res.render("register", { title: "Sample App" });
});

router.post("/register", loginValidate, function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("message", { message: errors.array().map((x) => x.msg) });
  }
  let username = req.body.username;
  let password = req.body.password;
  let confirm = req.body.confirm;
  console.log(username, password, confirm);
  if (password !== confirm) {
    return res.render("message", { message: "Password do not match" });
  }
  if (username in users) {
    return res.render("message", { message: "User already exist" });
  } else {
    users[username] = password;
    return res.redirect("login");
  }
});

router.get("/login", function (req, res, next) {
  res.render("login", { title: "Sample App" });
});

router.post("/login", loginValidate, function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("message", { message: errors.array().map((x) => x.msg) });
  }
  let username = req.body.username;
  let password = req.body.password;
  if (username in users === false) {
    return res.render("message", { message: "Invalid username or password" });
  } else {
    if (password !== users[username]) {
      return res.render("message", { message: "Invalid username or password" });
    }
    return res.redirect("/");
  }
});

module.exports = router;
