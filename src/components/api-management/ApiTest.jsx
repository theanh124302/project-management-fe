import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/ApiTest.css';

const backendUrl = 'http://localhost:8080';

const ApiTest = () => {
  const { projectId, folderId, apiId } = useParams();
  const [apiDetails, setApiDetails] = useState({ name: '', method: '', url: '' });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    priority: '',
    startDate: '',
    dueDate: '',
    lifeCycle: 'TEST'
  });
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchApiDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/api/findById?id=${apiId}`);
        const data = response.data.data;
        setApiDetails({
          name: data.name,
          method: data.method,
          url: data.url,
        });
      } catch (error) {
        console.error('Error fetching API details:', error);
      }
    };

    fetchApiDetails();
  }, [apiId]);

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleAddTask = async () => {
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const taskName = `Test: ${apiDetails.name} on ${currentDate}`;

    try {
      await axios.post(`${backendUrl}/api/v1/task/create`, {
        ...newTask,
        name: taskName,
        projectId: projectId,
        apiId: apiId,
        createdBy: userId,
        lifeCycle: 'TEST',
        startDate: currentDate
      });
      setShowTaskForm(false);
      setNewTask({ name: '', description: '', priority: '', startDate: '', dueDate: '', lifeCycle: 'TEST' });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setNewTask({ name: '', description: '', priority: '', startDate: '', dueDate: '', lifeCycle: 'TEST' });
  };

  return (
    <Container fluid className="api-test-container">
      <CustomAppBar />
      <Row>
        <Col xs={12} md={3}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={9} className='config'>
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>Test: {apiDetails.name}</Card.Title>
              <Row className="mt-4">
                <Col xs="auto">
                  <Button variant="warning" onClick={() => setShowTaskForm(true)}>
                    Create Task
                  </Button>
                </Col>
                <Col xs="auto">
                  <Button variant="primary" onClick={() => navigate(`/project/${projectId}/folder/${folderId}/api/${apiId}/develop`)}>
                    Develop
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal show={showTaskForm} onHide={handleCloseTaskForm}>
        <Modal.Header closeButton>
          <Modal.Title>Create Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTaskName" className="mb-3">
              <Form.Label>Task Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task name"
                name="name"
                value={newTask.name}
                onChange={handleTaskInputChange}
                disabled
              />
            </Form.Group>
            <Form.Group controlId="formTaskDescription" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter task description"
                name="description"
                value={newTask.description}
                onChange={handleTaskInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formTaskPriority" className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Control
                as="select"
                name="priority"
                value={newTask.priority}
                onChange={handleTaskInputChange}
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
                name="startDate"
                value={newTask.startDate}
                onChange={handleTaskInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formTaskDueDate" className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                name="dueDate"
                value={newTask.dueDate}
                onChange={handleTaskInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseTaskForm}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleAddTask}>
            Add Task
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ApiTest;
