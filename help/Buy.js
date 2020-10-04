const mongoose = require("mongoose");
const connectDB = require("../config/connection");
connectDB();

require("../model/Register");
const Register = mongoose.model("register");

require("../model/Book");
const Book = mongoose.model("book");

require("../model/Card");
const Card = mongoose.model("card");

module.exports = class Buy {
  constructor() {
    this.number = (Math.random() * 100).toFixed(2);
  }

  async searchBook() {
    const numberRandom = await Book.find().countDocuments();
    const numberBook = Math.floor(Math.random() * numberRandom);
    const resultBook = await Book.findOne().skip(numberBook);

    return resultBook;
  }

  typeSearch() {
    let opc;
    let type;

    if (this.number >= 29.01 && this.number <= 100) {
      opc = 1;
    } else if (this.number >= 1.01 && this.number <= 29) {
      opc = 2;
    } else if (this.number >= 0 && this.number <= 1) {
      opc = 3;
    }

    switch (opc) {
      case 1:
        type = "[R]";
        break;
      case 2:
        type = "[SR]";
        break;
      case 3:
        type = "[UR]";
        break;
    }

    return type;
  }

  async card() {
    const book = await this.searchBook();

    const buy = await Card.aggregate([
      {
        $lookup: {
          from: Book.collection.name,
          localField: "book_id",
          foreignField: "_id",
          as: "book_id",
        },
      },
      { $unwind: "$book_id" },
      {
        $project: {
          _id: false,
          cardName: "$cardName",
          anime: "$anime",
          cardURL: "$cardURL",
          typeRare: "$typeRare",
          book_id: "$book_id.bookName",
        },
      },
      { $match: { book_id: book.bookName, typeRare: this.typeSearch() } },
    ]);

    if (buy.length == 1) {
      return buy;
    } else {
      const index = Math.floor(Math.random() * buy.length);
      return buy[index];
    }
  }
};
