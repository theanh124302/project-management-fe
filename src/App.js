import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectTemplate from './components/template/ProjectTemplate';
import Environment from './components/project/ProjectEnvironment'; // Đảm bảo đường dẫn đúng
import Task from './components/project/Task';
import Board from './components/project/Board';
import Home from './components/Home'; // Trang chính Home hoặc trang quản lý dự án
import ProjectList from './components/project/ProjectList'; // Trang hiển thị danh sách dự án
import Login from './components/auth/Login'; // Trang đăng nhập

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/project/:projectId" element={<ProjectTemplate />}>
          <Route path="env" element={<Environment />} />
          <Route path="task" element={<Task />} />
          <Route path="board" element={<Board />} />
        </Route>
        {/* Các định tuyến khác */}
      </Routes>
    </Router>
  );
}

export default App;
