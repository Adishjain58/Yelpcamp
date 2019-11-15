const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

// Middleware
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

// Home Route
router.get("/", (req, res) => {
  res.render("landing");
});

// ===============
// Auth Routes
// ===============

// To show register from
router.get("/register", (req, res) => {
  res.render("register");
});

// To register user
router.post("/register", (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password)
    .then(() => {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/campgrounds");
      });
    })
    .catch(err => {
      console.log(err);
      res.redirect("/register");
    });
});

// To show login template
router.get("/login", (req, res) => {
  res.render("login");
});

// Handling login logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),
  (req, res) => {}
);

// Logout Route
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/campgrounds");
});

module.exports = router;
