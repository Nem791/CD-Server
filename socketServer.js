// Import necessary socket handlers
const newConnectionHandler = require("./socketHandlers/newConnectionHandler");
const createCardHandler = require("./socketHandlers/cards/createCardHandler");
const deleteCardHandler = require("./socketHandlers/cards/deleteCardHandler");
const serverStore = require("./severStore");
const getCardHandler = require("./socketHandlers/cards/getCardHandler");
const getStudiedCardHandler = require("./socketHandlers/cards/getStudiedCardHandler");
const getNotStudiedCardHandler = require("./socketHandlers/cards/getNotStudiedCardHandler");
const directMessageHandler = require("./socketHandlers/directMessageHandler");
const directChatHistoryHandler = require("./socketHandlers/directChatHistoryHandler");
const createScheduleHandler = require("./socketHandlers/schedule/createScheduleHandler");
const updateScheduleHandler = require("./socketHandlers/schedule/updateScheduleHandler");
const deleteScheduleHandler = require("./socketHandlers/schedule/deleteScheduleHandler");
const updateCardHandler = require("./socketHandlers/cards/updateCardHandler");
const disconnectHandler = require("./socketHandlers/disconnectHandler");
const inviteLinkingWordsHandler = require("./socketHandlers/Linking_Words/inviteHandler");
const cancelInviteHandler = require("./socketHandlers/Linking_Words/cancelInviteHandler");
const responseInviteHandler = require("./socketHandlers/Linking_Words/responseInviteHandler");

// Function to register the socket server
const registerSocketServer = (server) => {
  // Initialize socket.io server with CORS configuration
  const io = require("socket.io")(server, {
    cors: {
      // Allow connections from any origin
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Set the socket server instance for later use
  serverStore.setSocketServerInstance(io);

  // Function to emit online user information
  const emitOnlineUsers = () => {
    const onlineUsers = serverStore.getOnlineUsers();
    io.emit("online-users", { onlineUsers });
  };

  // Handle new connection event
  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Emit online users on connection
    emitOnlineUsers();

    // Join a room based on the set ID
    socket.on("join-set", (id) => {
      socket.join(id);
    });

    // Authenticate the connection
    socket.on("authenticate", (data) => {
      newConnectionHandler(socket, data);
    });

    // Create card event
    socket.on("create-card", (data) => {
      createCardHandler(data, socket);
    });

    // Delete card event
    socket.on("delete-card", (data) => {
      deleteCardHandler(data, socket);
    });

    // Get card event
    socket.on("get-card", (id) => {
      getCardHandler(id, socket);
    });

    // Get studied card event
    socket.on("get-studied", (id) => {
      getStudiedCardHandler(id, socket);
    });

    // Get not studied card event
    socket.on("get-not-studied", (id) => {
      getNotStudiedCardHandler(id, socket);
    });

    // Update card event
    socket.on("update-card", (data) => {
      updateCardHandler(data, socket);
    });

    // Direct message event
    socket.on("direct-message", (data) => {
      directMessageHandler(socket, data);
    });

    // Direct chat history event
    socket.on("direct-chat-history", (data) => {
      directChatHistoryHandler(socket, data);
    });

    // Invite to play event
    socket.on("invite-to-play", (data) => {
      inviteLinkingWordsHandler(socket, data);
    });

    // Cancel invite event
    socket.on("cancel-invite", (data) => {
      cancelInviteHandler(socket, data);
    });

    // Response to invitation event
    socket.on("response-invitation", (data) => {
      responseInviteHandler(socket, data);
    });

    // Start timer event
    let timer;
    socket.on("start-timer", () => {
      const remainingTime = 15;
      timer = setInterval(() => {
        remainingTime--;
        socket.emit("update-timer", remainingTime);
        if (remainingTime <= 0) {
          clearInterval(timer);
          socket.emit("game-over", { loser: socket.id });
        }
      }, 1000);
    });

    // Schedule events
    socket.on("join-schedule", (data) => {
      socket.join(data);
    });

    socket.on("create-schedule", (data) => {
      createScheduleHandler(socket, data);
    });

    socket.on("update-schedule", (data) => {
      updateScheduleHandler(socket, data);
    });

    socket.on("delete-schedule", (data) => {
      deleteScheduleHandler(socket, data);
    });

    // Handle disconnect event
    socket.on("disconnect", () => {
      disconnectHandler(socket);
    });
  });

  // Periodically emit online users information every 8 seconds
  setInterval(() => {
    emitOnlineUsers();
  }, [8000]);
};

// Export the registerSocketServer function
module.exports = {
  registerSocketServer,
};
