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
  constructor() {}

  async searchBook() {
    const numberRandom = await Book.find().countDocuments();
    const numberBook = Math.floor(Math.random() * numberRandom);
    const resultBook = await Book.findOne().skip(numberBook);

    return resultBook;
  }

  async typeSearch() {}

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
      { $match: { book_id: book.bookName, typeRare: "[UR]" } },
    ]);

    return buy;
  }
};
