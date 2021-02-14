const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");
const multer = require("multer");
const path = require("path");

// Index- show all campgrounds
router.get("/", (req, res) => {
  Campground.find({})
    .then(campgrounds => res.json(campgrounds))
    .catch(err => console.log(err));
});

// Create- add new campground to databse
router.post("/", middleware.isLoggedIn, (req, res) => {
      //Retrieving new camp data from form.
      let campName = req.body.name;
      let imageUrl = req.body.imageUrl;
      let description = req.body.description;
      let authorId = req.user._id;
      let authorName = req.user.username;
      let price = req.body.price;
      let imageAlt=req.body.imageAlt
      let newCamp = {
        name: campName,
        imageUrl,
        imageAlt,
        description,
        price,
        author: {
          id: authorId,
          username: authorName
        }
      };

      // Create a new campground and save in db.
      Campground.create(newCamp)
        .then(camp => {
          console.log(camp)
          res.json(camp);
        })
        .catch(err => console.log(err));
});

// SHOW -  To show details of a single campground.
router.get("/:id", (req, res) => {
  let campId = req.params.id;
  // Find the campground to show it's details.
  Campground.findById(campId)
    .populate("comments")
    .exec()
    .then(camp => {
      res.json(camp);
    })
    .catch(err => console.log(err));
});

// Edit Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id)
    .then(camp => {
      res.json(camp);
    })
    .catch(err => res.json({ err: "Camp not found" }));
});

// To Update the details of camp
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  let campName = req.body.name;
  let description = req.body.description;
  let authorId = req.user._id;
  let authorName = req.user.username;
  let price = req.body.price;
  let imageUrl=req.body.imageUrl;
 let imageAlt=req.body.imageAlt;
  let newCamp = {
    name: campName,
    imageUrl,
    imageAlt,
    description,
    price,
    author: {
      id: authorId,
      username: authorName
    }
  };
  console.log(newCamp)
  // To update the camp
  Campground.findByIdAndUpdate(req.params.id, newCamp)
    .then(camp => {
      res.json(camp);
    })
    .catch(err => console.log(err));
});

// To delete a campground
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id)
    .then(camp => {
      camp.comments.forEach(comment => {
        Comment.findByIdAndDelete(comment._id)
          .then(() => console.log("Comment deleted successfully"))
          .catch(err => console.log(err));
      });
      Campground.deleteOne(camp)
        .then(() => {
         
          res.json({ msg: "deleted Successfully" });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

// To like the post
router.post("/:id/like", middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id)
    .then(camp => {
      if (
        camp.likes.filter(like => like.author.equals(req.user.id)).length > 0
      ) {
        res.status(400).json({ err: "You have already liked this camp" });
      } else {
        camp.likes.push({ author: req.user.id });
        camp
          .save()
          .then(camp2 => {
            res.json(camp2);
          })
          .catch(() => {
            res.status(404).json({ err: "Camp is not created" });
          });
      }
    })
    .catch(() => {
      res.status(404).json({ err: "Camp is not found" });
    });
});

// To unlike the post
router.post("/:id/unlike", middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id).then(camp => {
    if (
      camp.likes.filter(like => like.author.equals(req.user.id)).length == 0
    ) {
      res.status(400).json({ error: "You have already liked the camp" });
    } else {
      const removeIndex = camp.likes
        .map(like => like.author.toString())
        .indexOf(req.user.id);
      camp.likes.splice(removeIndex, 1);

      camp
        .save()
        .then(camp2 => {
          res.json(camp2);
        })
        .catch(() => {
          res.status(404).json({ error: "Camp not found" });
        });
    }
  });
});

module.exports = router;
