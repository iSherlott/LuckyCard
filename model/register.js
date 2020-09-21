const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Register = new Schema({
  id: {
    type: Number,
  },
  wallet: {
    type: Number,
    default: 500,
  },
  card: [],
  emblem: [],
  daily: {
    type: String,
  },
  update: {
    type: String,
    default: "Não atualizado",
  },
  date: {
    type: String,
  },
});

mongoose.model("register", Register);
