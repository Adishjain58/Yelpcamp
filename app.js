const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const path = require('path');

// Routes Import
const commentRoutes = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const indexRoutes = require("./routes/index");
const userRoutes=require("./routes/user")

// Models Import
const User = require("./models/user");

// To start our app
const app = express();

// Body parser middleware.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

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

// To use all routes
app.use(indexRoutes);
app.use("/user",userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Serve static assets if in production
if(process.env.NODE_ENV==='production'){
  // Set static folder
  app.use(express.static('client/build'));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  });
}

// To retrieve the databse url.
const db = require('./config/keys').mongoURI;

// To setup a connection with the db.
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDb Connected"))
  .catch(err => console.log(err));

app.get("*", (req, res) => {
  res.send("<h1>This route does not exist</h1>");
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`App started at port: ${port}`);
});
