const Test = require("../models/testModel");

exports.TestService = {
  createTest: async function (data) {
    const newTests = await Test.create(data);
    return newTests;
  },

  getTest: async function (id) {
    const test = await Test.findById(id);
    return test;
  },
};
