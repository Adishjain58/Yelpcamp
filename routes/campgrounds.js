const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");

// Middleware
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

// Middleware to check user ownership
const checkCampgroundOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id)
      .then(camp => {
        // To check if user is authorized or not
        if (camp.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      })
      .catch(() => res.redirect("back"));
  } else {
    res.redirect("back");
  }
};

// Index- show all campgrounds
router.get("/", (req, res) => {
  // Get all campgrounds and render.
  Campground.find({})
    .then(campgrounds => res.render("campgrounds/index", { campgrounds }))
    .catch(err => console.log(err));
  // res.render("campgrounds", { campgrounds });
});

// Create- add new campground to databse
router.post("/", isLoggedIn, (req, res) => {
  // Retrieving new camp data from form.
  let campName = req.body.name;
  let imageUrl = req.body.image;
  let description = req.body.description;
  let authorId = req.user._id;
  let authorName = req.user.username;
  let newCamp = {
    name: campName,
    image: imageUrl,
    description,
    author: {
      id: authorId,
      username: authorName
    }
  };
  // Create a new campground and save in db.
  Campground.create(newCamp)
    .then(camp => {
      res.redirect("/campgrounds");
    })
    .catch(err => console.log(err));
  // Redirecting to campgrounds page
});

// NEW - show form to create a campground.
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// SHOW -  To show details of a single campground.
router.get("/:id", (req, res) => {
  let campId = req.params.id;
  // Find the campground to show it's details.
  Campground.findById(campId)
    .populate("comments")
    .exec()
    .then(camp => {
      res.render("campgrounds/show", { camp });
    })
    .catch(err => console.log(err));
  // render the show template.
});

// Edit Route
router.get("/:id/edit", checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id)
    .then(camp => {
      res.render("campgrounds/edit", { camp });
    })
    .catch(err => console.log(err));
});

// To Update the details of camp
router.put("/:id", checkCampgroundOwnership, (req, res) => {
  // Retrieving new camp data from form.
  let campName = req.body.name;
  let imageUrl = req.body.image;
  let description = req.body.description;
  let authorId = req.user._id;
  let authorName = req.user.username;
  let newCamp = {
    name: campName,
    image: imageUrl,
    description,
    author: {
      id: authorId,
      username: authorName
    }
  };
  Campground.findByIdAndUpdate(req.params.id, newCamp)
    .then(camp => {
      console.log(camp);
      res.redirect("/campgrounds/" + req.params.id);
    })
    .catch(err => console.log(err));
});

// To delete a campground
router.delete("/:id", checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id)
    .then(camp => {
      camp.comments.forEach(comment => {
        Comment.findByIdAndUpdate(comment._id)
          .then(() => console.log("Comment deleted successfully"))
          .catch(err => console.log(err));
      });
      Campground.findByIdAndDelete(req.params.id)
        .then(() => {
          console.log("Camp deleted successfully");
          res.redirect("/campgrounds");
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

module.exports = router;
