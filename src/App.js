// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Navbar from './Components/Navbar';
import Courses from './Components/Courses'; // Ensure this path is correct
import SearchResults from './Components/SearchResults'; // Import the SearchResults component
import Quiz from './Components/quiz'; // Import the Quiz component
import Chatbot from './Components/Chatbot'; // Import the Chatbot component


function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar should be above the Routes */}
      <Routes>
        {/* Protected routes below */}
        <Route path="/" element={<Home />} /> 
        <Route path="/courses" element={<Courses />} />
        <Route path="/search/:searchTerm" element={<SearchResults />} /> 
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/:searchQuery" element={<Quiz />} /> 
        <Route path="/chatbot" element={<Chatbot />} /> 
        {/* End of protected routes */}

     

      </Routes>
    </Router>
  );
}

export default App;