const mongoose = require("mongoose");

// Schema Setup
const campgroundSchema = mongoose.Schema({
  name: String,
  imageUrl: String,
  imageAlt:String,
  price: String,
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
  },
  likes: [
    {
      author: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
      }
    }
  ]
});

module.exports = Campground = mongoose.model("Campground", campgroundSchema);
