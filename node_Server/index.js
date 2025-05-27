const io = require("socket.io")(8000, {
  cors: {
    origin: "*", // Allow all origins for testing
    methods: ["GET", "POST"]
  }
});

const user = {};

io.on("connection", (socket) => {
  socket.on("new-user-join", (name) => {
    console.log("User joined:", name);
    user[socket.id] = name;

    // ✅ Notify all other users
    socket.broadcast.emit("user-join", name);
  });

  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", {
      data,
      name: user[socket.id]
    });
  });
  

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
