const mongoose = require("mongoose");

require("../model/CardObtained");
const CardObtained = mongoose.model("cardObtained");

module.exports = class Rank {
  async rank() {
    let consult = await CardObtained.aggregate([
      { $group: { _id: { id: "$id" }, total: { $sum: 1 } } },
      {
        $project: {
          _id: false,
          id: "$_id.id",
          total: "$total",
        },
      },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]);

    return consult;
  }

  async rankR() {
    let consult = await CardObtained.aggregate([
      { $match: { typeRare: "[R]" } },
      { $group: { _id: { id: "$id" }, total: { $sum: 1 } } },
      {
        $project: {
          _id: false,
          id: "$_id.id",
          total: "$total",
        },
      },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]);

    return consult;
  }

  async rankSR() {
    let consult = await CardObtained.aggregate([
      { $match: { typeRare: "[SR]" } },
      { $group: { _id: { id: "$id" }, total: { $sum: 1 } } },
      {
        $project: {
          _id: false,
          id: "$_id.id",
          total: "$total",
        },
      },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]);

    return consult;
  }

  async rankUR() {
    let consult = await CardObtained.aggregate([
      { $match: { typeRare: "[UR]" } },
      { $group: { _id: { id: "$id" }, total: { $sum: 1 } } },
      {
        $project: {
          _id: false,
          id: "$_id.id",
          total: "$total",
        },
      },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]);

    return consult;
  }
};
