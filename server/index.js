const express = require("express");
const app = express()
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const {Server} = require("socket.io")
const { generateReply } = require('./ai.js');


app.use(cors());

mongoose.connect("mongodb+srv://vanessanyc:Dec2001@bot.c6aqzxz.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,

});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);


    socket.on("message", (data) => {
        console.log(`Recieved message: ${data.message}`);
        const reply = generateReply(data.message);
        io.emit("message", [
            {message: data.message, isBotReply: false},
            {message: reply, isBotReply: true},
        ]);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

server.listen(3001, () => {
    console.log("SERVER RUNNING");
});