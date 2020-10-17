const mongoose = require("mongoose");

require("../model/cardobtained");
const CardObtained = mongoose.model("cardObtained");

module.exports = class SearchCard {
  constructor() {
    this.typebook;
  }

  async UpperText(bookName) {
    let text = bookName;
    let endText = "";
    let textUpper = [...text];
    textUpper[0] = textUpper[0].toUpperCase();
    textUpper.forEach((element) => {
      endText = endText + element;
    });
    if (endText == "Mahoushoujo") {
      endText = "MahouShoujo";
    }
    this.typebook = endText;
  }

  async book(id, bookName) {
    this.UpperText(bookName);
    let typebook = this.typebook;
    const cardobtrained = await CardObtained.find({
      typeBook: typebook,
      id: id,
    });

    return cardobtrained;
  }
};
