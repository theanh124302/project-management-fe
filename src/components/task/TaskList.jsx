import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import '../../public/css/TaskList.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, Modal, Typography } from '@mui/material';

const backendUrl = 'http://localhost:8080'; // Cập nhật URL backend cố định ở đây

const TaskList = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    status: '',
    priority: '',
    type: '',
    startDate: '',
    dueDate: ''
  });
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/task/findByProjectId?projectId=${projectId}`);
        setTasks(response.data.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [projectId]);

  const handleAddTask = async () => {
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    try {
      await axios.post(`${backendUrl}/api/v1/task/create`, {
        ...newTask,
        projectId: projectId,
        createdBy: userId,
      });
      setShowAddForm(false);
      setNewTask({ name: '', description: '', status: '', priority: '', type: '', startDate: '', dueDate: '' });
      const response = await axios.get(`${backendUrl}/api/v1/task/findByProjectId?projectId=${projectId}`);
      setTasks(response.data.data);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/v1/task/delete`, { data: { id: id } });
      const response = await axios.get(`${backendUrl}/api/v1/task/findByProjectId?projectId=${projectId}`);
      setTasks(response.data.data);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setNewTask({
      name: task.name,
      description: task.description,
      status: task.status,
      priority: task.priority,
      type: task.type,
      startDate: task.startDate,
      dueDate: task.dueDate
    });
    setShowEditForm(true);
  };

  const handleUpdateTask = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/task/update`, {
        ...currentTask,
        ...newTask,
      });
      setShowEditForm(false);
      setNewTask({ name: '', description: '', status: '', priority: '', type: '', startDate: '', dueDate: '' });
      setCurrentTask(null);
      const response = await axios.get(`${backendUrl}/api/v1/task/findByProjectId?projectId=${projectId}`);
      setTasks(response.data.data);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleTaskClick = (taskId) => {
    navigate(`/project/${projectId}/task/${taskId}`);
  };

  return (
    <div className="task-list-container">
      <CustomAppBar />
      <div style={{ display: 'flex' }}>
        <VerticalTabs projectId={projectId} />
        <div className="task-list-content">
          <h2>Task List</h2>
          <div className="task-list">
            {tasks.map((task) => (
              <div key={task.id} className="task-card" onClick={() => handleTaskClick(task.id)}>
                <h3>{task.name}</h3>
                <p>{task.description}</p>
                <p><strong>Status:</strong> {task.status}</p>
                <EditIcon className="icon edit-icon" onClick={(e) => { e.stopPropagation(); handleEditTask(task); }} />
                <DeleteIcon className="icon delete-icon" onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }} />
              </div>
            ))}
            <div className="task-card add-task-card" onClick={() => setShowAddForm(true)}>
              <span>+</span>
            </div>
          </div>
          <Modal
            open={showAddForm || showEditForm}
            onClose={() => { setShowAddForm(false); setShowEditForm(false); setCurrentTask(null); }}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Box className="task-modal">
              <Typography id="modal-title" variant="h6" component="h2">
                {showEditForm ? 'Edit Task' : 'Add New Task'}
              </Typography>
              <TextField
                label="Task Name"
                name="name"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                name="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                >
                  <MenuItem value="NOT_STARTED">NOT_STARTED</MenuItem>
                  <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
                  <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                  <MenuItem value="PENDING">PENDING</MenuItem>
                  <MenuItem value="ON_HOLD">ON_HOLD</MenuItem>
                  <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                  <MenuItem value="BLOCKED">BLOCKED</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Priority"
                name="priority"
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Type"
                name="type"
                value={newTask.type}
                onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Start Date"
                name="startDate"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={newTask.startDate}
                onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Due Date"
                name="dueDate"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                fullWidth
                margin="normal"
              />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={showEditForm ? handleUpdateTask : handleAddTask} variant="contained" color="primary">
                  {showEditForm ? 'Update Task' : 'Add Task'}
                </Button>
                <Button onClick={() => { setShowAddForm(false); setShowEditForm(false); setCurrentTask(null); }} variant="outlined">
                  Cancel
                </Button>
              </Box>
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
