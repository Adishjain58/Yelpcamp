const Campground = require("../models/campground");
const Comment = require("../models/comment");

const middlewareObject = {};

// Middleware to check user ownership
middlewareObject.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.commentId)
      .then(comment => {
        // To check if user is authorized or not
        if (comment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      })
      .catch(() => {
        req.flash("error", "comment not found");
        res.redirect("back");
      });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

// Middleware to check user ownership
middlewareObject.checkCampgroundOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id)
      .then(camp => {
        // To check if user is authorized or not
        if (camp.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      })
      .catch(() => {
        req.flash("error", "Campground not found");
        res.redirect("back");
      });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

// Middleware to check login
middlewareObject.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/login");
};

module.exports = middlewareObject;
