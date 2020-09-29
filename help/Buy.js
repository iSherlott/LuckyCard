const mongoose = require("mongoose");

require("../model/Book");
const Book = mongoose.model("book");

module.exports = class Buy {
  constructor() {
    this.number = parseFloat(Math.floor(Math.random() * 100));
  }

  async searchBook() {
    let arraybook = [];
    await Book.find({ bookOn: true })
      .select("name")
      .then((book) => {
        arraybook = book[Math.floor(Math.random() * book.length)];
      });

    return arraybook;
  }

  discoveryCard() {
    if (this.number >= 31 && this.number <= 100) {
      return "cardR";
    } else if (this.number >= 2 && this.number <= 30) {
      return "cardSR";
    } else if (this.number >= 0 && this.number <= 1) {
      return "cardUR";
    }
  }
};
