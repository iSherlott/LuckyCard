const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Register = new Schema({
  id: {
    type: String,
  },
  wallet: {
    type: Number,
    default: 500,
  },
  card: [],
  emblem: [],
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
