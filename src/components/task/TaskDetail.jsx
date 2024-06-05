import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, ListGroup, ListGroupItem } from 'react-bootstrap';
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
  const [username, setUsername] = useState('');
  const [assignError, setAssignError] = useState('');
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [newStatus, setNewStatus] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/task/findById?id=${taskId}`);
        setTask(response.data.data);
        setNewStatus(response.data.data.status);
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
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>{task.name}</Card.Title>
              <Card.Text><strong>Description:</strong> {task.description}</Card.Text>
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
              <Button variant="secondary" className="mt-3" onClick={() => navigate(-1)}>
                Back to Task List
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TaskDetail;
