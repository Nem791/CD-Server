const { UserService } = require("../services/user.service");
const catchAsync = require("../utils/catchAsync");

exports.promoteUser = catchAsync(async (req, res) => {
  const user = await UserService.promoteUser(req.params.userId);

  res.json({
    status: "succes",
    data: {
      user,
    },
  });
});

exports.upgradeUser = catchAsync(async (req, res) => {
  const user = await UserService.upgradeUser(req.params.userId);

  res.json({
    status: "succes",
    data: {
      user,
    },
  });
});
