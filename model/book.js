const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Book = new Schema({
  bookName: {
    type: String,
  },
});

mongoose.model("book", Book);
