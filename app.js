const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const cardRouter = require("./routes/cardRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const setRouter = require("./routes/setRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const questionRoutes = require("./routes/questionRoutes");
const testRoutes = require("./routes/testRoutes");
const answerHistoryRoutes = require("./routes/answerHistoryRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");

// 1. Tạo ứng dụng express
const app = express();
// app.use(cors());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3001",
  })
);

// 2. Ktra xem môi trường hiện tại mk đang code là môi trường j
// console.log(process.env.NODE_ENV);

// A. MIDDLEWARES
// A-0: morgan => ghi nhật ký request
// app.use(morgan("dev"));

// A-1. Data đc gửi từ client sẽ đc
// chuyển đổi sang kiểu json()
app.use(express.json());

// E. CookieParser
app.use(cookieParser());

// E-1:(Hàm in ra cookie mỗi khi login)
// app.use((req, res, next) => {
//   console.log(req.cookies);
//   next();
// });

// B. ROUTES
app.use("/api/v1/cards", cardRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/sets", setRouter);
app.use("/api/v1/questions", questionRoutes);
app.use("/api/v1/test", testRoutes);

app.use("/api/v1/schedule", scheduleRoutes);

// app.use("/api/v1/friend-invitation", friendInvitationRoutes);
app.use("/api/v1/answer-history", answerHistoryRoutes);

// C. Bắt lỗi các routes ko dc xử lý
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

// D. Error Handling Middleware
app.use(globalErrorHandler);
module.exports = app;
