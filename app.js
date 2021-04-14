const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const port = process.env.PORT || 3001;
const index = require('./routes/index');

const app = express();
//app.use(index);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://novisfirealert.ga:3000'],
        methods: ['GET', 'POST'],
    },
});

let interval;

io.on('connection', (socket) => {
    console.log('New client connected');
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);

    socket.on('chat message', (msg) => {
        console.log(msg);

        io.emit('chat message', msg);
    });

    socket.on('fire', (msg) => {
        console.log(msg);
        io.emit('fire', msg);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        clearInterval(interval);
    });
});
