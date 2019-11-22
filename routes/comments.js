const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Comment = require("../models/comment");

// Middleware
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

// omments new
router.get("/new", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id)
    .then(camp => res.render("comments/new", { camp }))
    .catch(err => console.log(err));
});

// Route to add a new comment
router.post("/", isLoggedIn, (req, res) => {
  // Lookup Campground using id.
  Campground.findById(req.params.id)
    .then(camp => {
      // Create new comment
      Comment.create(req.body.comment)
        .then(comment => {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;

          // Save the comment
          comment.save();
          // Connect new comment to campground.
          camp.comments.push(comment);
          camp
            .save()
            .then(() =>
              // Redirect back to show page of campground
              res.redirect("/campgrounds/" + camp._id)
            )
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

module.exports = router;
