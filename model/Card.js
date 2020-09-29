const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Card = new Schema({
  book_id: {
    type: Schema.Types.ObjectId,
  },
  cardName: {
    type: String,
  },
  anime: {
    type: String,
  },
  cardURL: {
    type: String,
  },
  typeRare: {
    type: String,
  },
});

mongoose.model("card", Card);
