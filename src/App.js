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


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/projectList' element={<ProjectList />} />
        <Route path='/project/:projectId/*' element={<Dashboard />} />
        <Route path='/profile' element={<UserProfile />} />
        <Route path='/project/:projectId/env' element={<EnvList />} />
        <Route path='/project/:projectId/detail' element={<ProjectDetail />} />
        <Route path='/project/:projectId/task' element={<TaskList />} />
        <Route path='/project/:projectId/task/:taskId' element={<TaskDetail />} />
        <Route path='/project/:projectId/task/:taskId/comment' element={<TaskComments />} />
        <Route path='/project/:projectId/api' element={<FolderList />} />
        <Route path='/project/:projectId/folder/:folderId/apis' element={<ApiList />} />
        <Route path='/project/:projectId/folder/:folderId/api/:apiId' element={<ApiDefine />} />
        <Route path='/project/:projectId/folder/:folderId/api/:apiId/design' element={<ApiDesign />} />
        <Route path='/project/:projectId/folder/:folderId/api/:apiId/designDocs' element={<DesignDocs />} />
        <Route path='/project/:projectId/folder/:folderId/api/:apiId/develop' element={<ApiDevelop />} />
        <Route path='/project/:projectId/folder/:folderId/api/:apiId/test' element={<ApiTest />} />
        <Route path='/project/:projectId/task/:taskId/request-done/*' element={<TaskRequest />} />
        <Route path='/project/:projectId/issue' element={<IssueList />} />  
        <Route path='/project/:projectId/issue/:issueId' element={<IssueDetail />} />
        <Route path='/project/:projectId/dashboard' element={<Dashboard />} />
        <Route path='/project/:projectId/schedule' element={<Schedule />} />
        <Route path='/project/:projectId/daily-report' element={<DailyReportList />} />
        <Route path='/project/:projectId/file' element={<FileList />} />
        <Route path='/project/:projectId/database' element={<DatabaseServerList />} />
        <Route path='/project/:projectId/database-server/:serverId/tables' element={<DatabaseTableList />} />
        <Route path='/project/:projectId/database-server/table/:tableId/fields' element={<DatabaseFieldList />} />
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
