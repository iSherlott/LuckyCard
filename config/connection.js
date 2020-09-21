const mongoose = require("mongoose");

const URI =
  "mongodb+srv://sherlott:1597534862@coinaisha.z0dkg.mongodb.net/CoinBot?retryWrites=true&w=majority";

const connectDB = () => {
  mongoose
    .connect(URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("Mongo Connectado");
    })
    .catch((err) => {
      console.log("Houve um erro ao tentar se conectar ao MongoAtlas: " + err);
    });
};

module.exports = connectDB;
