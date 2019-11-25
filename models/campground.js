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
  ],
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    username: String
  }
});

module.exports = Campground = mongoose.model("Campground", campgroundSchema);