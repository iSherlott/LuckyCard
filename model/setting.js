const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Setting = new Schema({
  serverID: {
    type: String,
  },
  channel: [],
  serverGM: {
    type: String,
  },
  member: [],
});

mongoose.model("setting", Setting);
