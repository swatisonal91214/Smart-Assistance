
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SmartAssistance from './components/SmartAssistance';
import ChatComponent from './components/ChatComponent';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SmartAssistance />} />
        <Route path="/chat" element={<ChatComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
