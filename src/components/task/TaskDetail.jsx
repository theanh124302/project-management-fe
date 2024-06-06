import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, ListGroup, ListGroupItem, Modal } from 'react-bootstrap';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/TaskDetail.css';

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

const TaskDetail = () => {
  const { taskId, projectId } = useParams();
  const [task, setTask] = useState(null);
  const [apiName, setApiName] = useState('');
  const [apiId, setApiId] = useState(null);
  const [folderId, setFolderId] = useState(null);
  const [lifeCycle, setLifeCycle] = useState('');
  const [username, setUsername] = useState('');
  const [assignError, setAssignError] = useState('');
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [newStatus, setNewStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    priority: '',
    startDate: '',
    dueDate: ''
  });
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/task/findById?id=${taskId}`);
        const taskData = response.data.data;
        setTask(taskData);
        setNewStatus(taskData.status);
        setLifeCycle(taskData.lifeCycle); // Set lifeCycle from task data
        setNewTask({
          name: taskData.name,
          description: taskData.description,
          priority: taskData.priority,
          startDate: taskData.startDate,
          dueDate: taskData.dueDate
        });
        
        // Fetch API details
        if (taskData.apiId) {
          const apiResponse = await axios.get(`${backendUrl}/api/v1/api/findById?id=${taskData.apiId}`);
          setApiName(apiResponse.data.data.name);
          setApiId(taskData.apiId);
          setFolderId(apiResponse.data.data.folderId); // Set folderId from API details
        }
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
        params: { taskId, username, assignerId: userId },
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
        params: { taskId, username, unAssignerId: userId },
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

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const handleUpdateStatus = async () => {
    try {
      const updatedTask = { ...task, status: newStatus };
      const response = await axios.post(`${backendUrl}/api/v1/task/update`, updatedTask);
      setTask(response.data.data);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleEditTask = () => {
    setShowForm(true);
  };

  const handleUpdateTask = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/task/update`, {
        ...task,
        ...newTask,
      });
      setShowForm(false);
      const response = await axios.get(`${backendUrl}/api/v1/task/findById?id=${taskId}`);
      setTask(response.data.data);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await axios.delete(`${backendUrl}/api/v1/task/delete`, { data: { id: taskId } });
      navigate(`/project/${projectId}/task`);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleApiClick = () => {
    if (apiId && folderId && lifeCycle) {
      let path;
      switch (lifeCycle) {
        case 'DEFINE':
          path = '';
          break;
        case 'DESIGN':
          path = 'design';
          break;
        case 'DEVELOP':
          path = 'develop';
          break;
        case 'TEST':
          path = 'test';
          break;
        case 'DEPLOY':
          path = 'deploy';
          break;
        case 'MAINTAIN':
          path = 'maintain';
          break;
        default:
          path = '';
      }
      navigate(`/project/${projectId}/folder/${folderId}/api/${apiId}/${path}`);
    }
  };

  if (!task) {
    return <p>Loading task details...</p>;
  }

  const isTaskCreatedByUser = task.createdBy === userId;

  return (
    <Container fluid className="task-detail-container">
      <CustomAppBar />
      <Row>
        <Col xs={12} md={3}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={9}>
          <Card className="mt-4 task-card">
            <Card.Body>
              <Card.Title>{task.name}</Card.Title>
              <Card.Text><strong>Description:</strong> {task.description}</Card.Text>
              <Card.Text>
                <strong>API Name:</strong>
                <span className="api-name-link" onClick={handleApiClick} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                  {apiName}
                </span>
              </Card.Text>
              <Card.Text>
                <strong>Status:</strong>
                <Form.Select
                  value={newStatus}
                  onChange={handleStatusChange}
                  disabled={!isTaskCreatedByUser}
                  className={`text-${statusColors[newStatus]}`}
                >
                  <option value="CANCELLED" className="text-danger">CANCELLED</option>
                  <option value="NOT_STARTED" className="text-secondary">NOT_STARTED</option>
                  <option value="IN_PROGRESS" className="text-info">IN_PROGRESS</option>
                  <option value="COMPLETED" className="text-success">COMPLETED</option>
                  <option value="BLOCKED" className="text-dark">BLOCKED</option>
                  <option value="ON_HOLD" className="text-warning">ON_HOLD</option>
                  <option value="PENDING" className="text-primary">PENDING</option>
                </Form.Select>
                {isTaskCreatedByUser && (
                  <Button variant="primary" className="mt-2" onClick={handleUpdateStatus}>
                    Update Status
                  </Button>
                )}
              </Card.Text>
              <Card.Text><strong>Priority:</strong> {task.priority}</Card.Text>
              <Card.Text><strong>Start Date:</strong> {task.startDate}</Card.Text>
              <Card.Text><strong>Due Date:</strong> {task.dueDate}</Card.Text>
              <Card.Text><strong>Created By:</strong> {task.createdBy}</Card.Text>
              <Card.Text><strong>Assignees:</strong></Card.Text>
              <ListGroup className="mb-3">
                {assignedUsers.map(user => (
                  <ListGroupItem key={user.id} className="d-flex justify-content-between align-items-center">
                    {user.name}
                    {isTaskCreatedByUser && (
                      <Button variant="danger" size="sm" onClick={() => handleUnassign(user.username)}>
                        Unassign
                      </Button>
                    )}
                  </ListGroupItem>
                ))}
              </ListGroup>
              {isTaskCreatedByUser && (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Assign User</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" onClick={handleAssign}>
                    Assign Task
                  </Button>
                  {assignError && <p className="text-danger mt-2">{assignError}</p>}
                </Form>
              )}
              {isTaskCreatedByUser && (
                <>
                  <Button variant="primary" className="mt-3 me-2" onClick={handleEditTask}>
                    Edit Task
                  </Button>
                  <Button variant="danger" className="mt-3" onClick={handleDeleteTask}>
                    Delete Task
                  </Button>
                </>
              )}
              <Button variant="secondary" className="mt-3" onClick={() => navigate(-1)}>
                Back to Task List
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal show={showForm} onHide={handleCloseForm}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
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
          <Button variant="primary" onClick={handleUpdateTask}>
            Update Task
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TaskDetail;
