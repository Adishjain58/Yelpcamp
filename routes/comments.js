const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// Route to add a new comment
router.post("/", middleware.isLoggedIn, (req, res) => {
  // Lookup Campground using id.
  Campground.findById(req.params.id)
    .then(camp => {
      // Create new comment
      const comment = {
        text: req.body.text
      };
      console.log(comment);
      Comment.create(comment)
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
            .then(() => {
              res.json(camp);
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

// Edit route
router.get("/:commentId/edit", middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.commentId)
    .then(comment => {
      res.json(comment);
    })
    .catch(err => {
      res.status(404).json({ err: "Campground not found" });
    });
});

// Update Route
router.put("/:commentId", middleware.checkCommentOwnership, (req, res) => {
  const comment = {
    text: req.body.text
  };
  Comment.findByIdAndUpdate(req.params.commentId, comment)
    .then(comment => {
      res.json(comment);
    })
    .catch(err => {
      res.status(404).json({ err: "Comment not found" });
    });
});

// Delete Route
router.delete("/:commentId", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndDelete(req.params.commentId)
    .then(() => {
      res.json({ success: "Comment deleted successfully" });
    })
    .catch(err => {
      res.status(404).json({ err: "Comment not found" });
    });
});

module.exports = router;
