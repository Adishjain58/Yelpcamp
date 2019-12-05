const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// comments new
router.get("/new", middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id)
    .then(camp => res.render("comments/new", { camp }))
    .catch(err => console.log(err));
});

// // Route to add a new comment
// router.post("/", middleware.isLoggedIn, (req, res) => {
//   // Lookup Campground using id.
//   Campground.findById(req.params.id)
//     .then(camp => {
//       // Create new comment
//       Comment.create(req.body.comment)
//         .then(comment => {
//           // add username and id to comment
//           comment.author.id = req.user._id;
//           comment.author.username = req.user.username;

//           // Save the comment
//           comment.save();
//           // Connect new comment to campground.
//           camp.comments.push(comment);
//           camp
//             .save()
//             .then(() => {
//               req.flash("success", "Successfully added comment");
//               // Redirect back to show page of campground
//               res.redirect("/campgrounds/" + camp._id);
//             })
//             .catch(err => console.log(err));
//         })
//         .catch(err => console.log(err));
//     })
//     .catch(err => console.log(err));
// });

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

// // Edit route
// router.get("/:commentId/edit", middleware.checkCommentOwnership, (req, res) => {
//   Comment.findById(req.params.commentId)
//     .then(comment => {
//       res.render("comments/edit", { comment, campId: req.params.id });
//     })
//     .catch(err => {
//       res.redirect("back");
//     });
// });

// Edit route
router.get("/:commentId/edit", middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.commentId)
    .then(comment => {
      res.json(comment);
    })
    .catch(err => {
      res.redirect("back");
    });
});

// // Update Route
// router.put("/:commentId", middleware.checkCommentOwnership, (req, res) => {
//   Comment.findByIdAndUpdate(req.params.commentId, req.body.comment)
//     .then(() => {
//       req.flash("success", "Comment updated successfully");
//       res.redirect("/campgrounds/" + req.params.id);
//     })
//     .catch(err => {
//       res.redirect("back");
//     });
// });

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
      res.redirect("back");
    });
});

// // Delete Route
// router.delete("/:commentId", middleware.checkCommentOwnership, (req, res) => {
//   Comment.findByIdAndDelete(req.params.commentId)
//     .then(() => {
//       req.flash("success", "Comment deleted successfully");
//       console.log("Comment deleted succcessfully");
//       res.redirect("back");
//     })
//     .catch(err => {
//       req.flash("error", "Comment not found");
//       res.redirect("back");
//     });
// });

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
