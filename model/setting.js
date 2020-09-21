const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Setting = new Schema({
  serverID: {
    type: Number,
  },
  channel: [],
  serverGM: {
    type: Number,
  },
  member: [],
});

mongoose.model("setting", Setting);
