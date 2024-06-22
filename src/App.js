import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import ProjectList from './components/project/ProjectList';
import UserProfile from './components/profile/UserProfile';
import EnvList from './components/env/EnvList';
import ProjectDetail from './components/project/ProjectDetail';
import TaskList from './components/task/TaskList';
import TaskDetail from './components/task/TaskDetail';
import TaskComments from './components/task/TaskComments';
import FolderList from './components/api-management/FolderList';
import ApiList from './components/api-management/ApiList';
import ApiDefine from './components/api-management/ApiDefine';
import ApiDesign from './components/api-management/ApiDesign';
import ApiDevelop from './components/api-management/ApiDevelop';
import ApiTest from './components/api-management/ApiTest';
import TaskRequest from './components/request-done/TaskRequest';
import DesignDocs from './components/api-management/DesignDocs';
import IssueList from './components/project-issue/IssueList';
import IssueDetail from './components/project-issue/IssueDetail';
import Dashboard from './components/project-dashboard/ProjectDashboard';
import Schedule from './components/scheduler/Scheduler';
import DailyReportList from './components/daily-report/DailyReportList';
import DatabaseServerList from './components/database-server/DatabaseServerList';
import DatabaseTableList from './components/database-server/DatabaseTableList';
import DatabaseFieldList from './components/database-server/DatabaseFieldList';
import FileList from './components/projectFile/FileList';
import ProtectedRoute from './components/hoc/ProtectedRoute';
import Test from './components/template/Test';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/projectList' element={<ProjectList />} />
        <Route path='/profile' element={<UserProfile />} />
        <Route path='/project/:projectId/env' element={<ProtectedRoute component={EnvList} />} />
        <Route path='/project/:projectId/detail' element={<ProtectedRoute component={ProjectDetail} />} />
        <Route path='/project/:projectId/task' element={<ProtectedRoute component={TaskList} />} />
        <Route path='/project/:projectId/task/:taskId' element={<ProtectedRoute component={TaskDetail} />} />
        <Route path='/project/:projectId/task/:taskId/comment' element={<ProtectedRoute component={TaskComments} />} />
        <Route path='/project/:projectId/api' element={<ProtectedRoute component={FolderList} />} />
        <Route path='/project/:projectId/folder/:folderId/apis' element={<ProtectedRoute component={ApiList} />} />
        <Route path='/project/:projectId/folder/:folderId/api/:apiId' element={<ProtectedRoute component={ApiDefine} />} />
        <Route path='/project/:projectId/folder/:folderId/api/:apiId/design' element={<ProtectedRoute component={ApiDesign} />} />
        <Route path='/project/:projectId/folder/:folderId/api/:apiId/designDocs' element={<ProtectedRoute component={DesignDocs} />} />
        <Route path='/project/:projectId/folder/:folderId/api/:apiId/develop' element={<ProtectedRoute component={ApiDevelop} />} />
        <Route path='/project/:projectId/folder/:folderId/api/:apiId/test' element={<ProtectedRoute component={ApiTest} />} />
        <Route path='/project/:projectId/task/:taskId/request-done/*' element={<ProtectedRoute component={TaskRequest} />} />
        <Route path='/project/:projectId/issue' element={<ProtectedRoute component={IssueList} />} />
        <Route path='/project/:projectId/issue/:issueId' element={<ProtectedRoute component={IssueDetail} />} />
        <Route path='/project/:projectId/dashboard' element={<ProtectedRoute component={Dashboard} />} />
        <Route path='/project/:projectId/schedule' element={<ProtectedRoute component={Schedule} />} />
        <Route path='/project/:projectId/daily-report' element={<ProtectedRoute component={DailyReportList} />} />
        <Route path='/project/:projectId/file' element={<ProtectedRoute component={FileList} />} />
        <Route path='/project/:projectId/database' element={<ProtectedRoute component={DatabaseServerList} />} />
        <Route path='/project/:projectId/database-server/:serverId/tables' element={<ProtectedRoute component={DatabaseTableList} />} />
        <Route path='/project/:projectId/database-server/table/:tableId/fields' element={<ProtectedRoute component={DatabaseFieldList} />} />
        <Route path='/test' element={<Test />} />
      </Routes>
    </Router>
  );
}

export default App;
