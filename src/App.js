import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import ProjectList from './components/project/ProjectList';
import ProjectDetailPage from './components/project/ProjectDetailPage';
import UserProfile from './components/profile/UserProfile';
import EnvList from './components/env/EnvList';
import ProjectDetail from './components/project/ProjectDetail';
import TaskList from './components/task/TaskList';
import TaskDetail from './components/task/TaskDetail';
import FolderList from './components/api-management/FolderList';
import ApiList from './components/api-management/ApiList';
import ApiDefine from './components/api-management/ApiDefine'; // Import ApiDefine
import ApiCreate from './components/api-management/ApiCreate';

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
        <Route path='/project/:projectId/task' element={<TaskList />} />
        <Route path='/project/:projectId/task/:taskId' element={<TaskDetail />} />
        <Route path='/project/:projectId/api' element={<FolderList />} />
        <Route path='/project/:projectId/folder/:folderId/apis' element={<ApiList />} />
        <Route path='/project/:projectId/folder/:folderId/api/:apiId' element={<ApiDefine />} /> {/* Route for viewing and editing an API */}
        <Route path='/project/:projectId/folder/:folderId/api/create' element={<ApiCreate />} />
      </Routes>
    </Router>
  );
}

export default App;
