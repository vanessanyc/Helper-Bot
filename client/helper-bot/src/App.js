
import './App.css';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:3001");


function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  const joinRoom = () => {

  }

  return (
    <div className="App">
      <h3>Helper Bot</h3>
      <input 
        type="text" 
        placeholder="" 
        onChange={(event) => {
          setUsername(event.target.value);
        }} 
      />
      <input type="text" placeholder=""/>
      <button>Enter</button>
    </div>
  );
}

export default App;
