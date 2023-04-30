
import './App.css';
import { io } from 'socket.io-client';
import { useState } from 'react';
import hbBot from './Helperbotrobot.png';

const socket = io.connect("http://localhost:3001");


function App() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    socket.emit("message", {message});
    console.log(`Message sent: ${message}`);
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
      <img src={hbBot} alt="Helper Bot" style={{width: '20%', height: 'auto'}}/>
      <h3>Helper Bot</h3>
      <div className="input-container">
        <input
          className="Font"
          type="text" 
          placeholder="Enter message" 
          value = {message} 
          onChange={handleMessageChange}
        />
        <button className= "Font" onClick={handleSendMessage}>Send</button>
      </div>
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