import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectList from './components/project/ProjectList';
import ProjectDetails from './components/project/ProjectDetails'; // Import component ProjectDetails
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import ProjectTemplate from './components/template/ProjectTemplate'; // Import component ProjectTemplate

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/projects' element={<ProjectList />} />
        <Route path='/project/:projectId' element={<ProjectDetails />} /> {/* Thêm route chi tiết dự án */}
        {/* <Route path='/projecttemplate' element={<ProjectTemplate />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
