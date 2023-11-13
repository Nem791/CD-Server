const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  console.log(err);
  process.exit(1);
});

dotenv.config();

const app = require("./app");
const { registerSocketServer } = require("./socketServer");

// Create an HTTP server instance
const server = http.createServer(app);

// Connect the socket.io server to the HTTP server
registerSocketServer(server);

// Connect to MongoDB
const DB = process.env.MONGO.replace("<PASSWORD>", process.env.MONGO_PASSWORD);
mongoose.connect(DB).then(() => {
  console.log("DB connection successful!");
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err);
  // Close the server and exit the process
  server.close(() => {
    process.exit(1);
  });
});
