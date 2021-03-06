const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Register = new Schema({
  id: {
    type: String,
  },
  level: {
    type: String,
    default: "01",
  },
  fortune: {
    type: Number,
  },
  exp: {
    type: Number,
    default: 0,
  },
  class: {
    type: String,
    default: "Novice",
  },
  wallet: {
    type: Number,
    default: 500,
  },
  daily: {
    type: Number,
  },
  update: {
    type: Number,
  },
  date: {
    type: Number,
  },
});

mongoose.model("register", Register);
