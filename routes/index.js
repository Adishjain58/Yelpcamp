const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

// ===============
// Auth Routes
// ===============

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

// Handling login logic
router.post("/login", passport.authenticate("local"), (req, res) => {
  User.findOne({ username: req.body.username })
    .then(user => res.json(user))
    .catch(err => res.status(404).json({ error: "Not Found" }));
});

// Logout Route
router.get("/logout", (req, res) => {
  req.logout();
  res.json({ msg: "Logged out successfully" });
});

module.exports = router;
