const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");

// Index- show all campgrounds
router.get("/", (req, res) => {
  // Get all campgrounds and render.
  Campground.find({})
    .then(campgrounds => res.render("campgrounds/index", { campgrounds }))
    .catch(err => console.log(err));
  // res.render("campgrounds", { campgrounds });
});

// Create- add new campground to databse
router.post("/", (req, res) => {
  // Retrieving new camp data from form.
  let campName = req.body.name;
  let imageUrl = req.body.image;
  let description = req.body.description;
  let newCamp = { name: campName, image: imageUrl, description };
  // Create a new campground and save in db.
  Campground.create(newCamp)
    .then(camp => {
      console.log(camp);
      res.redirect("/campgrounds");
    })
    .catch(err => console.log(err));
  // Redirecting to campgrounds page
});

// NEW - show form to create a campground.
router.get("/new", (req, res) => {
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
      console.log(camp);
    })
    .catch(err => console.log(err));
  // render the show template.
});

module.exports = router;
