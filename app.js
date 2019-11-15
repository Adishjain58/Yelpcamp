const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const seedDB = require("./seeds");
const app = express();

// Body parser middleware.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static("public"));

// To retrieve the databse url.
const db = require("./config/keys").mongoURI;

// To setup a connection with the db.
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDb Connected"))
  .catch(err => console.log(err));

// DB Cleanup
// seedDB();

// Home Route
app.get("/", (req, res) => {
  res.render("landing");
});

// Index- show all campgrounds
app.get("/campgrounds", (req, res) => {
  // Get all campgrounds and render.
  Campground.find({})
    .then(campgrounds => res.render("campgrounds/index", { campgrounds }))
    .catch(err => console.log(err));
  // res.render("campgrounds", { campgrounds });
});

// Create- add new campground to databse
app.post("/campgrounds", (req, res) => {
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
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// SHOW -  To show details of a single campground.
app.get("/campgrounds/:id", (req, res) => {
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

// =====================
// Comment Routes
// =====================

app.get("/campgrounds/:id/comments/new", (req, res) => {
  Campground.findById(req.params.id)
    .then(camp => res.render("comments/new", { camp }))
    .catch(err => console.log(err));
});

// Route to add a new comment
app.post("/campgrounds/:id/comments", (req, res) => {
  // Lookup Campground using id.
  Campground.findById(req.params.id)
    .then(camp => {
      // Create new comment
      Comment.create(req.body.comment)
        .then(comment => {
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

app.get("*", (req, res) => {
  res.send("<h1>This route does not exist</h1>");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App started at port: ${port}`);
});
