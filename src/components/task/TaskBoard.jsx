import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import VerticalTabs from '../tabs/VerticalTabs';
import CustomAppBar from '../navbar/CustomAppBar';
import '../../public/css/TaskBoard.css';

const TaskBoard = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    status: 'NOT_STARTED',
    projectId: projectId,
    createdBy: localStorage.getItem('userId'),
  });

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/task/findByProjectId?projectId=${projectId}`);
      setTasks(response.data.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async () => {
    try {
      await axios.post('http://localhost:8080/api/v1/task/create', newTask);
      fetchTasks();
      setShowAddForm(false);
      setNewTask({
        name: '',
        description: '',
        status: 'NOT_STARTED',
        projectId: projectId,
        createdBy: localStorage.getItem('userId'),
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/task/delete`, { data: { id: taskId } });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.post('http://localhost:8080/api/v1/task/update', { id: taskId, status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const renderTaskColumn = (status) => (
    <div className="task-column">
      <h3>{status.replace('_', ' ')}</h3>
      {tasks.filter(task => task.status === status).map(task => (
        <div key={task.id} className="task-card">
          <p>{task.name}</p>
          <button onClick={() => handleStatusChange(task.id, 'IN_PROGRESS')}>Move to In Progress</button>
          <button onClick={() => handleStatusChange(task.id, 'COMPLETED')}>Move to Completed</button>
          <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
        </div>
      ))}
      <button onClick={() => setShowAddForm(true)}>+</button>
    </div>
  );

  return (
    <div className="task-board-container">
      <CustomAppBar />
      <VerticalTabs />
      <div className="task-board-content">
        {renderTaskColumn('NOT_STARTED')}
        {renderTaskColumn('IN_PROGRESS')}
        {renderTaskColumn('COMPLETED')}
      </div>
      {showAddForm && (
        <div className="task-form">
          <h3>Add New Task</h3>
          <input
            type="text"
            placeholder="Task Name"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <button onClick={handleAddTask}>Add Task</button>
          <button onClick={() => setShowAddForm(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
