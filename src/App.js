import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import ProjectList from './components/project/ProjectList';
import ProjectDetailPage from './components/project/ProjectDetailPage';
import UserProfile from './components/profile/UserProfile';
import EnvList from './components/env/EnvList';
import ProjectDetail from './components/project/ProjectDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/projectList' element={<ProjectList />} />
        <Route path='/project/:projectId/*' element={<ProjectDetailPage />} />
        <Route path='/profile' element={<UserProfile />} />
        <Route path='/project/:projectId/env' element={<EnvList />} />
        <Route path='/project/:projectId/detail' element={<ProjectDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
