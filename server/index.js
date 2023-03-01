const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const natural = require('natural');
const sentiment = require('sentiment');
const cors = require("cors");

app.use(cors());

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin:"http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) =>{
    console.log(`User Connected: ${socket.id}`);
    socket.on("send_message", (data) => {
        handleMessage(data, (response) => {
            io.emit("receive_message", response);
        });
    })
});

const handleMessage = (message, callback) => {  
    console.log('Received message:', message);
    if (typeof message.message === 'string'){
        const greetings = ['hi', 'hello', 'hey', 'greetings'];
        const goodbyes = ['bye', 'goodbye', 'see you', 'take care'];
        const questions = ['who', 'what', 'where', 'when', 'why', 'how'];
    
        let response = "I'm sorry, I don't understand. Can you please rephrase?";
    
        const words = message.message.split(' ');
    
        // Check if the message is a greeting
        if (words.some(word => greetings.includes(word.toLowerCase()))) {
        response = 'Hello there! How can I assist you?';
        }
        // Check if the message is a goodbye
        else if (words.some(word => goodbyes.includes(word.toLowerCase()))) {
        response = 'Goodbye! Have a great day.';
        }
        // Check if the message is a question
        else if (words.some(word => questions.includes(word.toLowerCase()))) {
        response = 'I am an AI chatbot and I do not have all the answers. However, I can try my best to help you. What would you like to know?';
        }
    
        // If no specific message type is identified, return a generic response
        callback('Helper Bot: ' + response);
        console.log('Helper Bot:', response);
    }
    else {
        console.error('Message must be a string');
    }
  };
  
server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});