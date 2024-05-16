import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import ProjectTemplate from './components/template/ProjectTemplate';
import Home from './components/Home';

export default function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/project" element={<ProjectTemplate />} />
          <Route path="/home" element={<Home />} />
          {/* Add more routes here if needed */}
        </Routes> 
      </div>
    </Router>
  );
}