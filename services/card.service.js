const { Types } = require("mongoose");
const Card = require("../models/cardModel");

exports.CardService = {
  getAllCards: async function (name) {
    let query = name;
    if (!query) {
      query = {};
    }
    const cards = await Card.find(query);
    return cards;
  },

  getCardById: async function (id) {
    const card = await Card.findOne({ _id: new Types.ObjectId(id) });
    return card;
  },

  createCard: async function (data) {
    const newCard = await Card.create(data);
    return newCard;
  },

  updateCard: async function (id, data) {
    const card = await Card.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      data
    );
    return card;
  },

  deleteCardById: async function (id) {
    const card = await Card.findByIdAndDelete(id);
    return card;
  },

  getCardsBySet: async function (id) {
    const cards = await Card.find({ setId: id });
    return cards;
  },
};
