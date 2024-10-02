// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Navbar from './Components/Navbar';
import Courses from './Components/Courses'; // Ensure this path is correct
import SearchResults from './Components/SearchResults'; // Import the SearchResults component

import Quiz from './Components/quiz';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/search/:searchTerm" element={<SearchResults />} /> {/* Route for search results */}
        <Route path="/quiz" element={<Quiz/>} /> {/* Route for quiz */}
        <Route path="/quiz/:searchQuery" element={<Quiz/>} /> {/* Route for quiz with search query */}
        {/* Define other routes here */}
      </Routes>
    </Router>
  );
}

export default App;