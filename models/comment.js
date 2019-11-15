const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = Schema({
  text: String,
  author: String
});

module.exports = Comment = mongoose.model("Comment", CommentSchema);
