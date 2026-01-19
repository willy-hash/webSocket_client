import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../ChatApp.css';

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {

    // Inicializar socket
    socketRef.current = io("https://webscoketrender.onrender.com", {
      transports: ["websocket"],
      withCredentials: true
    });
    
    // Escuchar mensajes
    socketRef.current.on('chat message', (msg) => {
      console.log('message received from server: ', msg);

      setMessages((prevMessages) => [...prevMessages, msg]);
      
    });

    socketRef.current.on("connect", () => {

      setConnected(true);

      console.log("Conectado al servidor:", socketRef.current.id);
    });


    socketRef.current.on("connect_error", (error) => {
      console.error("Error de conexión:", error.message);
    });

    socketRef.current.on("error", (error) => {
      console.error("Error del socket:", error);
    });


    socketRef.current.on("disconnect", (reason, details) =>  {

      setConnected(false);

      console.log({
        messages : 'disconnected from server',
        reason : reason,
        details : details
      });

    });


    // Cleanup al desmontar
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);


  // Scroll automático cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      socketRef.current.emit('chat message', inputValue);
      setInputValue('');
    }
  };

  return (
    <>
      <ul id="messages">
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
        <li ref={messagesEndRef} style={{ height: 0 }}></li>
      </ul>
      
      <p>Estado: {connected ? "Conectado" : "Desconectado"}</p>
  
      <form id="form" onSubmit={handleSubmit}>
        <input
          id="input"
          type="text"
          autoComplete="off"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default ChatApp;