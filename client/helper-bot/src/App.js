
import './App.css';
import { io } from 'socket.io-client';
import { useState } from 'react';

const socket = io.connect("http://localhost:3001");


function App() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    socket.emit("message", {message});
    setMessage("");
  };

  socket.on("message", (data) => {
    setMessages([
      ...messages,
      { message: data[0].message, isBot: false },
      { message: data[1].message, isBot: true },
    ]);
  });
  

  return (
    <div className="App">
      <h3>Helper Bot</h3>
      <input
        className="Font"
        type="text" 
        placeholder="Enter message" 
        value = {message} 
        onChange={handleMessageChange}
      />
      <button className= "Font" onClick={handleSendMessage}>Send</button>
      <div>
        <br></br>
        {messages.map((message, index) => (
          <div key={index}> 
            <br />
            {message.isBot ? (
              <strong>Helper Bot: </strong>
            ) : (
              <strong>You: </strong>
            )}
            {message.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
