const express = require("express");
const cors = require('cors')
const http = require("http");
const socketIo = require("socket.io");



const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();

var corsOptions = {
  origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://192.168.0.47:3000',
  ],
  methods: ["GET", "POST"],
  credentials: true,
};




app.use(index);


const server = http.createServer(app);

const io = socketIo(server); 
io.use(cors(corsOptions));
let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));