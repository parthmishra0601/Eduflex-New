// src/Chatbot.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [careerAdvice, setCareerAdvice] = useState({});

  useEffect(() => {
    // Fetch career advice from the JSON file
    const fetchCareerAdvice = async () => {
      try {
        const response = await axios.get('/careerAdvice.json');
        setCareerAdvice(response.data);
      } catch (error) {
        console.error('Error fetching career advice:', error);
      }
    };

    fetchCareerAdvice();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const botResponse = await generateResponse(input.toLowerCase());
    const botMessage = { text: botResponse, sender: 'bot' };
    setMessages((prevMessages) => [...prevMessages, botMessage]);

    setInput('');
  };

  const generateResponse = (input) => {
    if (input.includes('hello') || input.includes('hi')) {
      return 'Hello! How can I assist you today?';
    } else if (input.includes('how are you')) {
      return 'I am just a bot, but I am here to help you!';
    } else if (input.includes('what is your name')) {
      return 'I am your friendly chatbot!';
    } else if (input.includes('tell me a joke')) {
      return 'Why don’t scientists trust atoms? Because they make up everything!';
    } else if (input.includes('engineering')) {
      return getRandomResponse(careerAdvice.engineering);
    } else if (input.includes('mbbs')) {
      return getRandomResponse(careerAdvice.mbbs);
    } else if (input.includes('what to do after 12th')) {
      return getRandomResponse(careerAdvice.after12th);
    } else {
      return "I'm not sure how to respond to that. You can ask about career paths after 12th!";
    }
  };

  const getRandomResponse = (responses) => {
    if (responses && responses.length > 0) {
      const randomIndex = Math.floor(Math.random() * responses.length);
      return responses[randomIndex];
    }
    return "I'm not sure about that. Can you ask something else?";
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <h1 className="text-center text-2xl mb-4">Chatbot</h1>

      <div className="flex-1 overflow-auto mb-4">
        <div className="flex flex-col space-y-4">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  msg.sender === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 text-gray-800 self-start'
                }`}
              >
                {msg.text}
              </div>
            ))
          ) : (
            <div className="text-gray-500">No messages yet. Start chatting!</div>
          )}
        </div>
      </div>

      <div className="flex">
        <input
          type="text"
          className="flex-1 border rounded-lg p-3"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-blue-500 text-white rounded-lg px-4"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
