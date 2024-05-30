import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import { Box, Typography, Paper, Button, TextField, IconButton, List, ListItem, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import '../../public/css/TaskDetail.css';

const backendUrl = 'http://localhost:8080'; // Cập nhật URL backend cố định ở đây

const TaskDetail = () => {
  const { taskId, projectId } = useParams();
  const [task, setTask] = useState(null);
  const [username, setUsername] = useState('');
  const [assignError, setAssignError] = useState('');
  const [assignedUsers, setAssignedUsers] = useState([]);
  const navigate = useNavigate();
  const assignerId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/task/findById?id=${taskId}`);
        setTask(response.data.data);
      } catch (error) {
        console.error('Error fetching task detail:', error);
      }
    };

    const fetchAssignedUsers = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/user/findByTaskId/${taskId}`);
        setAssignedUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching assigned users:', error);
      }
    };

    fetchTaskDetail();
    fetchAssignedUsers();
  }, [taskId]);

  const handleAssign = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/task/assignByUsername`, null, {
        params: { taskId, username, assignerId },
      });
      const response = await axios.get(`${backendUrl}/api/v1/task/findById?id=${taskId}`);
      setTask(response.data.data);
      const usersResponse = await axios.get(`${backendUrl}/api/v1/user/findByTaskId/${taskId}`);
      setAssignedUsers(usersResponse.data.data);
      setAssignError('');
    } catch (error) {
      setAssignError('Failed to assign task. Make sure the username is correct.');
      console.error('Error assigning task:', error);
    }
  };

  const handleUnassign = async (username) => {
    try {
      await axios.post(`${backendUrl}/api/v1/task/unassignByUsername`, null, {
        params: { taskId, username, unAssignerId: assignerId },
      });
      const response = await axios.get(`${backendUrl}/api/v1/task/findById?id=${taskId}`);
      setTask(response.data.data);
      const usersResponse = await axios.get(`${backendUrl}/api/v1/user/findByTaskId/${taskId}`);
      setAssignedUsers(usersResponse.data.data);
      setAssignError('');
    } catch (error) {
      setAssignError('Failed to unassign task. Make sure the username is correct.');
      console.error('Error unassigning task:', error);
    }
  };

  if (!task) {
    return <Typography variant="h6">Loading task details...</Typography>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <CustomAppBar />
      <div style={{ display: 'flex' }}>
        <VerticalTabs projectId={projectId} />
        <div style={{ marginLeft: '20px', padding: '20px', flex: 1 }}>
          <Paper elevation={3} className="task-detail-container">
            <Typography variant="h4">{task.name}</Typography>
            <Typography variant="body1"><strong>Description:</strong> {task.description}</Typography>
            <Typography variant="body1"><strong>Status:</strong> {task.status}</Typography>
            <Typography variant="body1"><strong>Priority:</strong> {task.priority}</Typography>
            <Typography variant="body1"><strong>Type:</strong> {task.type}</Typography>
            <Typography variant="body1"><strong>Start Date:</strong> {task.startDate}</Typography>
            <Typography variant="body1"><strong>Due Date:</strong> {task.dueDate}</Typography>
            <Typography variant="body1"><strong>Created By:</strong> {task.createdBy}</Typography>
            <Typography variant="body1"><strong>Created At:</strong> {task.createdAt}</Typography>
            <Typography variant="body1"><strong>Assignees:</strong></Typography>
            <List>
              {assignedUsers.map(user => (
                <ListItem key={user.id} secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleUnassign(user.username)}>
                    <DeleteIcon />
                  </IconButton>
                }>
                  <ListItemText primary={user.name} primaryTypographyProps={{ className: 'assigned-user-name' }} />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 3 }}>
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button variant="contained" color="primary" onClick={handleAssign} sx={{ mt: 2, mr: 2 }}>
                Assign Task
              </Button>
              {assignError && <Typography color="error" variant="body2" sx={{ mt: 2 }}>{assignError}</Typography>}
            </Box>
            <Box sx={{ mt: 3 }}>
              <Button variant="contained" color="primary" onClick={() => navigate(-1)}>Back to Task List</Button>
            </Box>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
