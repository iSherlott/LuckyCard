const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Book = new Schema({
  bookOn: {
    type: Boolean,
  },
  name: {
    type: String,
  },
  card: {
    type: Array,
  },
  anime: {
    type: Array,
  },
  cardURL: {
    type: Array,
  },
  typeRare: {
    type: Array,
  },
  date: {
    type: String,
  },
});

mongoose.model("book", Book);
