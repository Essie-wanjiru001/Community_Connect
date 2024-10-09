import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Replace with your backend URL

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chat message', { message, sender: 'user1', receiver: 'user2' });
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Real-Time Chat</h2>
        <div className="mb-4 h-64 overflow-y-auto border p-4 bg-gray-50 rounded-md shadow-inner">
          <ul className="space-y-4">
            {messages.map((msg, index) => (
              <li key={index} className="bg-gray-200 p-2 rounded-md">
                <strong>{msg.sender}:</strong> {msg.message}
              </li>
            ))}
          </ul>
        </div>
        <form onSubmit={sendMessage} className="flex space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
