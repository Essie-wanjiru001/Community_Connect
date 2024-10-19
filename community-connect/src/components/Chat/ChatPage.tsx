import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../../contexts/AuthContext';

type Message = {
  sender: string;
  receiver: string;
  message: string;
  timestamp: string;
};

const ChatPage: React.FC<{ otherUserId: string; otherUserName: string }> = ({
  otherUserId,
  otherUserName,
}) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize Socket.IO and setup listeners
  useEffect(() => {
    if (!user) return;

    // Ensure we don't reconnect multiple times
    if (!socketRef.current) {
      const socket = io('http://localhost:5000', {
        transports: ['websocket'],
        reconnectionAttempts: 5,
      });

      socketRef.current = socket;

      const roomId = [user.id, otherUserId].sort().join('-');
      socket.emit('join room', { userId: user.id, otherUserId });

      // Fetch previous messages when joining the room
      socket.emit('fetch messages', roomId);

      // Listen for previous messages
      socket.on('previous messages', (msgs: Message[]) => {
        setMessages(msgs);
      });

      // Listen for new incoming chat messages
      socket.on('chat message', (msg: Message) => {
        setMessages((prev) => [...prev, msg]);
      });

      // Listen for typing indicator from other users
      socket.on('typing', ({ sender }) => {
        if (sender !== user.name) {
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 3000);
        }
      });
    }

    // Cleanup: Disconnect socket and remove listeners on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, otherUserId]);

  // Scroll to the latest message when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() && socketRef.current && user) {
      const newMessage: Message = {
        sender: user.name,
        receiver: otherUserName,
        message,
        timestamp: new Date().toISOString(),
      };

      socketRef.current.emit('chat message', newMessage);
      setMessage('');
    }
  };

  const handleTyping = () => {
    if (user) {
      socketRef.current?.emit('typing', {
        sender: user.name,
        receiver: otherUserName,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Chat with {otherUserName}
        </h2>

        <div className="mb-4 h-72 overflow-y-auto border p-4 bg-gray-50 rounded-lg shadow-inner">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">
              No messages found! Start chatting now.
            </p>
          ) : (
            <ul className="space-y-2">
              {messages.map((msg, index) => (
                <li
                  key={index}
                  className={`flex ${
                    msg.sender === user?.name ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl shadow ${
                      msg.sender === user?.name
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-black'
                    } max-w-xs`}
                  >
                    <p className="text-sm font-medium">{msg.sender}</p>
                    <p className="mt-1">{msg.message}</p>
                    <span className="text-xs text-gray-400 block mt-2">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </li>
              ))}
              <div ref={messagesEndRef} />
            </ul>
          )}
        </div>

        {isTyping && (
          <p className="text-sm text-gray-500 mb-2">
            {otherUserName} is typing...
          </p>
        )}

        <form onSubmit={sendMessage} className="flex items-center space-x-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleTyping} // Updated from onKeyPress to onKeyDown
            className="flex-1 p-3 border rounded-full focus:outline-none focus:ring focus:ring-indigo-300"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className={`p-3 rounded-full transition ${
              message.trim()
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!message.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-9.564-5.151A2.015 2.015 0 002 7.684v8.632a2.015 2.015 0 003.188 1.667l9.564-5.15a2.016 2.016 0 000-3.466z"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
