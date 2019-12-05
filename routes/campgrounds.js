const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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
  storage: storage,
  limits: { fileSize: 10000000 }
}).single("myImage");

// Function to delete the image and here value is the path of image that is going to be deleted.
const deleteFile = imagePath => {
  // Converting it acc. to windows.
  imagePath = imagePath.replace(/[/]/, "\\");
  // Retrieving current directory path
  let direct = __dirname;
  // changing to get the new path
  direct = direct.substr(0, direct.length - 6);
  // Deleting the old file
  fs.unlinkSync(direct + "public\\" + imagePath);
};

// Index- show all campgrounds
router.get("/", (req, res) => {
  Campground.find({})
    .then(campgrounds => res.json(campgrounds))
    .catch(err => console.log(err));
});

// Create- add new campground to databse
router.post("/", middleware.isLoggedIn, (req, res) => {
  upload(req, res, err => {
    if (err) {
      console.log(err);
    } else {
      //Retrieving new camp data from form.
      let campName = req.body.name;
      let newUrl = `uploads/${req.file.filename}`;
      let description = req.body.description;
      let authorId = req.user._id;
      let authorName = req.user.username;
      let price = req.body.price;
      let newCamp = {
        name: campName,
        image: newUrl,
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
          res.json(camp);
        })
        .catch(err => console.log(err));
    }
  });
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
    .catch(err => console.log(err));
});

// To Update the details of camp
router.put("/:id", upload, middleware.checkCampgroundOwnership, (req, res) => {
  let campName = req.body.name;
  let description = req.body.description;
  let authorId = req.user._id;
  let authorName = req.user.username;
  let price = req.body.price;
  let newUrl;

  if (req.file) {
    deleteFile(req.body.hidden);
    // Retrieving new camp data from form.
    newUrl = `uploads/${req.file.filename}`;
  } else {
    newUrl = req.body.hidden;
  }
  let newCamp = {
    name: campName,
    image: newUrl,
    description,
    price,
    author: {
      id: authorId,
      username: authorName
    }
  };

  // To update the camp
  Campground.findByIdAndUpdate(req.params.id, newCamp)
    .then(camp => {
      res.json(camp);
    })
    .catch(err => console.log(err));
});

// To delete a campground
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  let url;
  Campground.findById(req.params.id)
    .then(camp => {
      url = camp.image;
      camp.comments.forEach(comment => {
        Comment.findByIdAndDelete(comment._id)
          .then(() => console.log("Comment deleted successfully"))
          .catch(err => console.log(err));
      });
      Campground.deleteOne(camp)
        .then(() => {
          deleteFile(url);
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
