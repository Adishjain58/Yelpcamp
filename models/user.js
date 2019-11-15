const mongoose = require("mongoose");
const passportLocalMongose = require("passport-local-mongoose");

const UserSchema = mongoose.Schema({
  username: String,
  password: String
});

UserSchema.plugin(passportLocalMongose);

module.exports = User = mongoose.model("User", UserSchema);
