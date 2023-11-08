const jwt = require("jsonwebtoken");
const { promisify } = require("util");
// promisify: Converts a callback function into a function returning a Promise
const crypto = require("crypto");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  // 1. Create a JWT token
  const token = signToken(user._id);

  // 2. Send a cookie to the client
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // (cookie will expire in)
    // secure: true,
    // (cookie will only be sent over an encrypted connection (https)),
    httpOnly: true,
    // (the browser cannot access or modify the cookie)
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  // res.cookie("jwt", token, cookieOptions);

  // Remove the password from the database
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);
  // Create a JWT token
  createSendToken(newUser, 201, res);
});

exports.signUpWithGoogle = catchAsync(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (!user) {
    const newUser = await User.create(req.body);
    createSendToken(newUser, 201, res);
  } else {
    createSendToken(user, 200, res);
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // Step 1: Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // Step 2: Check if the user exists
  const user = await User.findOne({ email }).select("+password");

  // Check if the user's password sent matches with the password in the database
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password!", 401));
  }
  // Step 3: Send a token to the client
  createSendToken(user, 200, res);
});

// Check if the user is logged in from the frontend
exports.onAuthStateChanged = async (req, res) => {
  try {
    let token;
    if (req.params.token) {
      token = req.params.token;
    }

    if (!token) {
      return res.json({
        isLogin: false,
        message: "You are not logged in! Please log in to get access.",
      });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.json({
        isLogin: false,
        message: "The user belonging to this token does no longer exist.",
      });
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.json({
        isLogin: false,
        message: "User recently changed password! Please log in again.",
      });
    }

    res.json({
      isLogin: true,
      user: currentUser,
    });
  } catch (err) {
    res.json({
      isLogin: false,
    });
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1. Get the token from the request headers
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
  // 2. Check if the token is valid
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3. Check if the user exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does no longer exist.")
    );
  }
  // 4. Check if the user has changed their password since the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }
  // (decoded.iat: the time when the token was created)

  // 5. Pass user information to subsequent middlewares
  // (this middleware)
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action.", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  // 1. Get the user based on the user's email (from a Post request)
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with the email address.", 404));
  }
  // 2. Create a random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // (Save resetToken to the database (and we won't validate in this case))
  // 3. Send it to the user's email
  // (the link that the user clicks to reset the password)

  // const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email.`;
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;
    // (resetToken is the unencrypted token)

    await new Email(user, resetToken).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    console.log(err);
    // Reset token and token expiration time
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
};
exports.resetPassword = async (req, res, next) => {
  // 1. Get the user based on the token in the request
  // (we'll hash the token once again and compare it with the hashed token in the database)
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2. If the token hasn't expired, and the user exists
  // => set a new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3. Update the changedPasswordAt property of the user
  // (we'll write this function in the userModel)
  // 4. Log the user in
  // (to send a JWT token to the user)
  createSendToken(user, 200, res);
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1. Get the user from the Collection
  const user = await User.findById(req.user.id).select("+password");
  // (req.user.id comes from the protect middleware)
  // 2. Check if the provided password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong", 401));
  }
  // 3. If it's correct, update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // 4. Log the user in again
  // (to send a JWT to the user)
  createSendToken(user, 200, res);
});
