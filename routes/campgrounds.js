const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");
const multer = require("multer");
const path = require("path");

// Set storage engine to upload the images
const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

// Init upload to upload the image
const upload = multer({
  storage: storage
}).single("image");

// Index- show all campgrounds
router.get("/", (req, res) => {
  // Get all campgrounds and render.
  Campground.find({})
    .then(campgrounds => res.render("campgrounds/index", { campgrounds }))
    .catch(err => console.log(err));
  // res.render("campgrounds", { campgrounds });
});

// Create- add new campground to databse
router.post("/", middleware.isLoggedIn, (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.render("/campgrounds/new");
    } else {
      // Retrieving new camp data from form.
      let campName = req.body.name;
      let newUrl = `uploads/${req.file.filename}`;
      let description = req.body.description;
      let authorId = req.user._id;
      let authorName = req.user.username;
      let newCamp = {
        name: campName,
        image: newUrl,
        description,
        author: {
          id: authorId,
          username: authorName
        }
      };

      // Create a new campground and save in db.
      Campground.create(newCamp)
        .then(camp => {
          req.flash("success", "Campground created successfully");
          res.redirect("/campgrounds");
        })
        .catch(err => console.log(err));
      // Redirecting to campgrounds page
    }
  });
});

// NEW - show form to create a campground.
router.get("/new", middleware.isLoggedIn, (req, res) => {
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
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id)
    .then(camp => {
      res.render("campgrounds/edit", { camp });
    })
    .catch(err => console.log(err));
});

// To Update the details of camp
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
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
          console.log("Camp deleted successfully");
          res.redirect("/campgrounds");
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

module.exports = router;
