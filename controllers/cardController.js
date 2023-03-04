const mongoose = require("mongoose");

const Card = require("../models/cardModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllCards = catchAsync(async (req, res) => {
  const cards = await Card.find();
  res.status(200).json({
    status: "success",
    results: cards.length,
    data: {
      cards,
    },
  });
});

exports.getCard = (req, res) => {
  res.status(200).json({
    status: "success",
  });
};

exports.createCard = catchAsync(async (req, res) => {
  const newCard = await Card.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      cards: newCard,
    },
  });
});

exports.updateCard = (req, res) => {
  res.status(201).json({
    status: "success",
  });
};

exports.deleteCard = (req, res) => {
  res.status(204).json({
    status: "success",
  });
};

exports.getAllCardInASet = catchAsync(async (req, res, next) => {
  const isValidId = mongoose.Types.ObjectId.isValid(req.setId);
  if (!isValidId) {
    return next(new AppError("Invalid setID.", 404));
  }
  const cardList = await Card.find({ setId: req.setId });

  res.status(200).json({
    status: "success",
    results: cardList.length,
    data: {
      cardList,
    },
  });
});
