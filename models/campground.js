const mongoose = require("mongoose");

// Schema Setup
const campgroundSchema = mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

module.exports = Campground = mongoose.model("Campground", campgroundSchema);
