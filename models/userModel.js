const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Must have to provide Email"],
    unique: [true, "Email must have to be unique"],
  },
  password: {
    type: String,
    required: [true, "Must have to provide password"],
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
