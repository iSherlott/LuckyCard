const mongoose = require("mongoose");

require("../model/CardObtained");
const CardObtained = mongoose.model("cardObtained");

module.exports = class Sale {
  async Search(searchIten) {
    let consult = await CardObtained.findOne({
      cardName: { $regex: searchIten, $options: "i" },
      id: "738064956372680715",
    }).then((e) => console.log(e.cardName));

    return consult;
  }
};
