const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Book = new Schema({
  bookName: {
    type: String,
  },
});
//book
mongoose.model("book", Book);
