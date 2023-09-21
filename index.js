const express = require("express");
const socket = require("socket.io");
const app = express();

const server = app.listen(5000, () => {
  console.log(`Server is running on http://localhost:5000/`);
});
const io = socket(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socketClient) => {
  const groupName = "Group A";
  console.log(socketClient.id);
  socketClient.on("JOINROOM", (clientName) => {
    console.log(clientName);
    socketClient.join(groupName); //this is to create a room
    io.to(groupName).emit(
      "SUCCESSROOM",
      `${clientName} Joined Room Successfully`,
      socketClient.id,
      groupName
    );
    socketClient.emit("USERNAME", clientName, socketClient.id);
    socketClient.on("SENDROOMMSG", (clientData) => {
      io.to(groupName).emit(
        "sendtoRoomMsg",
        clientData,
        clientName,
        socketClient.id
      ); //this is for sending message inside room
    });
  });
});

app.get("/", (req, res) => {
  res.send("<html><body><h1>This is the Home Page.</h1></body></html>");
});
