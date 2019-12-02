const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

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

// // To register user
// router.post("/register", (req, res) => {
//   const newUser = new User({ username: req.body.username });
//   User.register(newUser, req.body.password)
//     .then(user => {
//       passport.authenticate("local")(req, res, () => {
//         req.flash("success", "Welcome to yelpcamp " + user.username);
//         res.redirect("/campgrounds");
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       req.flash("error", err.message);
//       res.redirect("/register");
//     });
// });

// To register user
router.post("/register", (req, res) => {
  let error = {};
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password)
    .then(user => {
      passport.authenticate("local")(req, res, () => {
        res.json(user);
      });
    })
    .catch(err => {
      error.exists = "User Already exists";
      res.status(400).json({ error });
    });
});

// To show login template
router.get("/login", (req, res) => {
  res.render("login");
});

// // Handling login logic
// router.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/campgrounds",
//     failureRedirect: "/login"
//   }),
//   (req, res) => {}
// );

// Handling login logic
router.post("/login", passport.authenticate("local"), (req, res) => {
  User.findOne({ username: req.body.username })
    .then(user => res.json(user))
    .catch(err => res.status(404).json({ error: "Not Found" }));
});

// Logout Route
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/campgrounds");
});

module.exports = router;
