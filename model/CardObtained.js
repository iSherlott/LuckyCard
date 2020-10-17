const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CardObtained = new Schema({
  id: {
    type: String,
  },
  cardName: {
    type: String,
  },
  amount: {
    type: Number,
  },
  typeRare: {
    type: String,
  },
  typeBook: {
    type: String,
  },
});
//cardobt
mongoose.model("cardObtained", CardObtained);
