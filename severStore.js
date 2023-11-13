const { v4: uuidv4 } = require("uuid");

// Create a Map to store connected users and remember the initial insertion order of keys
const connectedUsers = new Map();

// Array to store active rooms
let activeRooms = [];

// Variable to store the socket.io instance
let io = null;

// Function to set the socket.io server instance
const setSocketServerInstance = (ioInstance) => {
  io = ioInstance;
};

// Function to get the socket.io server instance
const getSocketServerInstance = () => {
  return io;
};

// Function to add a new connected user to the Map
const addNewConnectedUser = ({ socketId, userId }) => {
  connectedUsers.set(socketId, { userId });
  // Log the newly connected users
  console.log("new connected users");
  console.log(connectedUsers);
};

// Function to get all active connections for a given userId
const getActiveConnections = (userId) => {
  const activeConnections = [];

  // Iterate through connectedUsers Map
  connectedUsers.forEach(function (value, key) {
    // Check if userId matches the provided userId
    if (value.userId === userId) {
      activeConnections.push(key);
    }
  });

  return activeConnections;
};

// Function to get information about all online users
const getOnlineUsers = () => {
  const onlineUsers = [];

  // Iterate through connectedUsers Map
  connectedUsers.forEach((value, key) => {
    onlineUsers.push({ socketId: key, userId: value.userId });
  });

  return onlineUsers;
};

// Function to remove a connected user when they disconnect
const removeConnectedUser = (socketId) => {
  // Check if the connectedUsers Map contains the provided socketId
  if (connectedUsers.has(socketId)) {
    connectedUsers.delete(socketId);
    // Log the updated connected users after removal
    console.log("new connected users");
    console.log(connectedUsers);
  }
};

// Export all functions for use in other modules
module.exports = {
  getSocketServerInstance,
  setSocketServerInstance,
  addNewConnectedUser,
  getActiveConnections,
  getOnlineUsers,
  removeConnectedUser,
};
