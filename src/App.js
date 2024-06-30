import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './module/auth/Login';
import SignUp from './module/auth/SignUp';
import ProjectList from './module/project/ProjectList';
import UserProfile from './module/profile/UserProfile';
import EnvList from './module/env/EnvList';
import ProjectDetail from './module/project/ProjectDetail';
import TaskList from './module/task/TaskList';
import TaskDetail from './module/task/TaskDetail';
import TaskComments from './module/task/TaskComments';
import FolderList from './module/api-management/FolderList';
import ApiList from './module/api-management/ApiList';
import ApiDefine from './module/api-management/ApiDefine';
import ApiDesign from './module/api-management/ApiDesign';
import ApiDevelop from './module/api-management/ApiDevelop';
import ApiTest from './module/api-management/ApiTest';
import TaskRequest from './module/request-done/TaskRequest';
import DesignDocs from './module/api-management/DesignDocs';
import IssueList from './module/project-issue/IssueList';
import IssueDetail from './module/project-issue/IssueDetail';
import Dashboard from './module/project-dashboard/ProjectDashboard';
import Schedule from './module/scheduler/Scheduler';
import DailyReportList from './module/daily-report/DailyReportList';
import DatabaseServerList from './module/database-server/DatabaseServerList';
import DatabaseTableList from './module/database-server/DatabaseTableList';
import DatabaseFieldList from './module/database-server/DatabaseFieldList';
import FileList from './module/projectFile/FileList';
import ProtectedRoute from './module/hoc/ProtectedRoute';
import Test from './module/template/Test';

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
