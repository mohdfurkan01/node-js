const mongoose = require("mongoose");

//Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      //can be empty
    },
    email: {
      type: String,
      required: true,
      unique: true, //same id can not be exist in my DB
    },

    jobTitle: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  //timestamps add krne se db me createdAt aur updatedAt dikhega like  createdAt: 2025-01-08T17:22:39.135Z,
  { timestamps: true }
);

//Model
const User = mongoose.model("user", userSchema);

module.exports = User;
