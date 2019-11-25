const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const methodOverride = require("method-override");
const flash = require("connect-flash");

// Routes Import
const commentRoutes = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const indexRoutes = require("./routes/index");

// Models Import

const User = require("./models/user");

// To start our app
const app = express();

// Body parser middleware.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Configure passport
app.use(
  require("express-session")({
    secret: "Key to encode",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// To pass the current user data to every template
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// To use all routes
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// To retrieve the databse url.
const db = require("./config/keys").mongoURI;

// To setup a connection with the db.
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDb Connected"))
  .catch(err => console.log(err));

app.get("*", (req, res) => {
  res.send("<h1>This route does not exist</h1>");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App started at port: ${port}`);
});
