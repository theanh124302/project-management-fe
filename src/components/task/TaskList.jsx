import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/TaskList.css';

const backendUrl = 'http://localhost:8080'; // Cập nhật URL backend cố định ở đây

const statusColors = {
  CANCELLED: 'danger',
  NOT_STARTED: 'secondary',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  BLOCKED: 'dark',
  ON_HOLD: 'warning',
  PENDING: 'primary',
};

const TaskList = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    priority: '',
    startDate: '',
    dueDate: ''
  });
  const [projectLeaderId, setProjectLeaderId] = useState(null);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchProjectDetails();
    fetchTasks();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/project/findById?id=${projectId}`);
      setProjectLeaderId(response.data.data.leaderId);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/task/findByProjectId?projectId=${projectId}`);
      setTasks(response.data.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchTasksByStatus = async (status) => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/task/findByProjectIdAndStatus?projectId=${projectId}&status=${status}`);
      setTasks(response.data.data);
    } catch (error) {
     
      console.error('Error fetching tasks by status:', error);
    }
  };

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
      setShowForm(false);
      setNewTask({ name: '', description: '', priority: '', startDate: '', dueDate: '' });
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleTaskClick = (taskId) => {
    navigate(`/project/${projectId}/task/${taskId}`);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setCurrentTask(null);
    setNewTask({ name: '', description: '', priority: '', startDate: '', dueDate: '' });
  };

  const handleStatusFilterChange = (e) => {
    const selectedStatus = e.target.value;
    setStatusFilter(selectedStatus);
    if (selectedStatus === '') {
      fetchTasks();
    } else {
      fetchTasksByStatus(selectedStatus);
    }
  };

  return (
    <Container fluid className="task-list-container">
      <CustomAppBar />
      <Row>
        <Col xs={12} md={3}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={9}>
          <h2>Task List</h2>
          <div className="d-flex justify-content-end mb-3">
            <Form.Group controlId="formStatusFilter" className="d-flex align-items-center">
              <Form.Label className="me-2">Filter by Status:</Form.Label>
              <Form.Control as="select" value={statusFilter} onChange={handleStatusFilterChange} className="w-auto">
                <option value="">All</option>
                {Object.keys(statusColors).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </div>
          <Row className="justify-content-center">
            {tasks.map((task) => (
              <Col key={task.id} xs={12} md={6} lg={4} className="mb-3">
                <Card onClick={() => handleTaskClick(task.id)} className={`task-card border-${statusColors[task.status]}`} style={{ cursor: 'pointer' }}>
                  <Card.Body>
                    <Card.Title>{task.name}</Card.Title>
                    <Card.Text>{task.description}</Card.Text>
                    <Card.Text>
                      <strong>Status:</strong> <span className={`text-${statusColors[task.status]}`}>{task.status}</span>
                    </Card.Text>
                    <Card.Text>
                      <strong>Due Date:</strong> {task.dueDate}
                    </Card.Text>
                    <Card.Text>
                      <strong>Priority:</strong> {task.priority}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            <Col xs={12} md={6} lg={4} className="mb-3">
              <Card onClick={() => setShowForm(true)} className="task-card add-task-card" style={{ cursor: 'pointer' }}>
                <Card.Body className="d-flex justify-content-center align-items-center">
                  <h1>+</h1>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Modal show={showForm} onHide={handleCloseForm}>
            <Modal.Header closeButton>
              <Modal.Title>{currentTask ? 'Edit Task' : 'Add New Task'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formTaskName" className="mb-3">
                  <Form.Label>Task Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter task name"
                    value={newTask.name}
                    onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formTaskDescription" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter task description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formTaskPriority" className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Control
                    as="select"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formTaskStartDate" className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newTask.startDate}
                    onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formTaskDueDate" className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseForm}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAddTask}>
                {currentTask ? 'Update Task' : 'Add Task'}
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default TaskList;
