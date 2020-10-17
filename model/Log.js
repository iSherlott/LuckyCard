const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Log = new Schema({
  command: {
    type: Array,
  },
  servidor_Name: {
    type: String,
  },
  servidor_id: {
    type: String,
  },
  channel_id: {
    type: String,
  },
  game_master: {
    type: String,
  },
  memberCount: {
    type: Number,
  },
  region: {
    type: String,
  },
});
//log
mongoose.model("log", Log);
