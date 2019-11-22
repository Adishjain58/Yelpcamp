const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    username: String
  }
});

module.exports = Comment = mongoose.model("Comment", CommentSchema);
