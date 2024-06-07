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
import TaskComments from './components/task/TaskComments'; // Import TaskComments
import FolderList from './components/api-management/FolderList';
import ApiList from './components/api-management/ApiList';
import ApiDefine from './components/api-management/ApiDefine';
import ApiDesign from './components/api-management/ApiDesign';
import ApiDevelop from './components/api-management/ApiDevelop';
import DefineTaskRequest from './components/request-done/DefineTaskRequest';
import DesignDocs from './components/api-management/DesignDocs';
import IssueList from './components/project-issue/IssueList'
import IssueDetail from './components/project-issue/IssueDetail';
import Dashboard from './components/project-dashboard/ProjectDashboard';


// import DesignTaskRequest from './components/request-done/DesignTaskRequest';
// import DevelopTaskRequest from './components/request-done/DevelopTaskRequest';
// import TestTaskRequest from './components/request-done/TestTaskRequest';
// import DeployTaskRequest from './components/request-done/DeployTaskRequest';
// import MaintainTaskRequest from './components/request-done/MaintainTaskRequest';

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
        <Route path='/project/:projectId/task/:taskId/comment' element={<TaskComments />} /> {/* Add TaskComments route */}
        <Route path='/project/:projectId/api' element={<FolderList />} />
        <Route path='/project/:projectId/folder/:folderId/apis' element={<ApiList />} />
        <Route path='/project/:projectId/folder/:folderId/api/:apiId' element={<ApiDefine />} />
        <Route path='/project/:projectId/folder/:folderId/api/:apiId/design' element={<ApiDesign />} />
        <Route path='/project/:projectId/folder/:folderId/api/:apiId/designDocs' element={<DesignDocs />} />
        <Route path='/project/:projectId/folder/:folderId/api/:apiId/develop' element={<ApiDevelop />} />
        <Route path='/project/:projectId/task/:taskId/request-done/define' element={<DefineTaskRequest />} />
        <Route path='/project/:projectId/issue' element={<IssueList />} />  
        <Route path='/project/:projectId/issue/:issueId' element={<IssueDetail />} />
        <Route path='/project/:projectId/dashboard' element={<Dashboard />} />
        {/* <Route path='/project/:projectId/task/:taskId/request-done/design' element={<DesignTaskRequest />} />
        <Route path='/project/:projectId/task/:taskId/request-done/develop' element={<DevelopTaskRequest />} />
        <Route path='/project/:projectId/task/:taskId/request-done/test' element={<TestTaskRequest />} />
        <Route path='/project/:projectId/task/:taskId/request-done/deploy' element={<DeployTaskRequest />} />
        <Route path='/project/:projectId/task/:taskId/request-done/maintain' element={<MaintainTaskRequest />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
