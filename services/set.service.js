const { Types } = require("mongoose");
const Set = require("../models/setModel");

exports.SetService = {
  getSetById: async function (id) {
    const set = await Set.findOne({ _id: new Types.ObjectId(id) });
    return set;
  },

  getSets: async function (userId) {
    const set = await Set.aggregate().match({
      createdBy: new Types.ObjectId(userId),
    });
    console.log(set);
    return set;
  },

  createSet: async function (data) {
    const newSets = await Set.create(data);
    return newSets;
  },

  updateSet: async function (id, data) {
    const set = await Set.findByIdAndUpdate(id, data, {
      new: true,
      // (trả về document mới nhất)
      runValidators: true,
      // (có chạy trình validate)
    });

    return set;
  },

  deleteSet: async function (id) {
    const set = await Set.findByIdAndDelele(id);
    return set;
  },
};
