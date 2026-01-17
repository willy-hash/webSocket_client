import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../ChatApp.css';

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Inicializar socket
    socketRef.current = io("https://webscoketrender.onrender.com");

    // Escuchar mensajes
    socketRef.current.on('chat message', (msg) => {
      console.log('message received from server: ', msg);

      setMessages((prevMessages) => [...prevMessages, msg]);

      socketRef.current.on('disconnect', () => {
        console.log('disconnected from server');
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
